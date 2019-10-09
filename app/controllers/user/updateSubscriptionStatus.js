const logger = require('../../utils/logger');
const User = require('../../models/User');
const Subscription = require('../../models/Subscription');
const PauseReason = require('../../models/PauseReason');
const open = require('amqplib');
const rabbitMQConnection = require('../../utils/messageQueue/rabbitMQConnector');
const orderQueue = 'order';
const orderRetryQueue = 'order-retry';
const orderEx = 'order';
const orderRetryEx = 'order-retry'; 

function updateSubscriptionStatus (req, res, next) {

    const subscription = req.body.subscription;
    const subscriptionId = subscription.subscriptionId;
    

    if (!subscription ||!subscriptionId) {

        logger.error(`updateSubscriptionStatus request is failed | bad request`);
        return res.status(400).json({
            status: 'failed',
            message: 'bad request'
        });

    }

    User.findById(req.user._id)
    .populate({
        path: 'subscriptions'
    })
    .then(user => {

        if (!user) {
            logger.warn(`updateSubscriptionStatus request is failed | unknown user`);
            return res.status(422).json({
                status: 'failed',
                message: 'unknown user'
            });
        }

        if (user && !user.subscriptions[0]) {
            logger.warn(`updateSubscriptionStatus request is failed | no subscription | ${subscriptionId}`);
            return res.status(422).json({
                status: 'failed',
                message: 'no subscription'
            });
        }

        if (user && user.subscriptions[0]) {

            if (subscriptionId !== user.subscriptions[0].subscriptionId) {
                logger.warn(`updateSubscriptionStatus request is failed | incorrect subscription id | ${subscriptionId}`);
                return res.status(422).json({
                    status: 'failed',
                    message: 'incorrect subscription id'
                });
            }

            Subscription.findOne({ subscriptionId: subscriptionId })
            .then(subscription => {

                if (!subscription) {
                    logger.warn(`updateSubscriptionStatus request is failed | unknown subscription number`);
                    return res.status(422).json({
                        status: 'failed',
                        message: 'unknown subscription number'
                    });
                }

                if (subscription) {
                    const isActive = subscription.isActive;
                    subscription.isActive = !isActive;
                    subscription.lastModified = Date.now();
                    subscription.markModified('isActive');
                    subscription.markModified('lastModified');

                    // subscription will be resumed
                    if (subscription.isActive === true) {
                        const newDeliverySchedule = subscription.setFirstDeliverySchedule(subscription.deliveryDay);
                        subscription.deliverySchedules = [newDeliverySchedule];
                        subscription.markModified('deliverySchedules');

                        open.connect(rabbitMQConnection()).then(conn => {
                            conn.createChannel()
                            .then(ch => {
                                const exchange = ch.assertExchange(orderEx, 'direct', { durable: true });
                                const retryExchange = ch.assertExchange(orderRetryEx, 'direct', { durable: true });
                                const bindQueue = ch.bindQueue(orderQueue, orderEx);
                                const bindRetryQueue = ch.bindQueue(orderRetryQueue, orderRetryEx);

                                Promise.all([
                                    exchange,
                                    retryExchange,
                                    bindQueue,
                                    bindRetryQueue
                                ]).then(() => {
                                    const message = {
                                        actionType: 'createOrder',
                                        subscriptionId: subscriptionId
                                    }
                                    ch.publish(orderEx, '', Buffer.from(JSON.stringify(message)), { persistent: true });
                                    ch.close().then(() => {
                                        conn.close();
                                        subscription.save().then(() => {
                                            logger.info(`updateSubscriptionStatus request has processed | ${subscription.subscriptionId} has activated`);
                                            return res.status(200).json({
                                                status: 'success',
                                                subscriptionId: subscription.subscriptionId,
                                                message: 'subscription is activated'
                                            });
                                        }).catch(next);
                                    });

                                })
                            });
                        }).catch(next);
                    }

                    // subscription will be paused
                    if (subscription.isActive === false) {

                        // save PauseReason in db
                        let pauseReason = new PauseReason();
                        pauseReason.email = user.email;
                        pauseReason.userId = user.userId;
                        pauseReason.firstName = user.firstName;
                        pauseReason.lastName = user.lastName;
                        
                        if (req.body.pauseReason) {
                            pauseReason.reason = req.body.pauseReason;
                        }
                        pauseReason.save();

                        // dispatch cancelOrders action to MQ
                        open.connect(rabbitMQConnection()).then(conn => {
                            conn.createChannel()
                            .then(ch => {
                                const exchange = ch.assertExchange(orderEx, 'direct', { durable: true});
                                const retryExchange = ch.assertExchange(orderRetryEx, 'direct', { durable: true });
                                const bindQueue = ch.bindQueue(orderQueue, orderEx);
                                const bindRetryQueue = ch.bindQueue(orderRetryQueue, orderRetryEx);

                                Promise.all([
                                    exchange,
                                    retryExchange,
                                    bindQueue,
                                    bindRetryQueue
                                ]).then(() => {

                                    const message = {
                                        actionType: 'cancelOutstandingOrders',
                                        subscriptionId: subscriptionId
                                    }

                                    ch.publish(orderEx, '', Buffer.from(JSON.stringify(message)), { persistent: true });
                                    ch.close().then(()=> {
                                        // close MQ connection after dispatcing message
                                        conn.close();
                                        subscription.save().then(()=> {
                                            logger.info(`updateSubscriptionStatus request has processed | ${subscription.subscriptionId} has inactivated`);
                                            return res.status(200).json({
                                                status: 'success',
                                                subscriptionId: subscriptionId,
                                                message: 'subscription is paused'
                                            });
                                        }).catch(next);

                                    });
                                })
                            })
                        }).catch(next);

                    }
                }

            }).catch(next);

        }

    }).catch(next);
}

module.exports = updateSubscriptionStatus;