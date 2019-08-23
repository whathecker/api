const Subscription = require('../../models/Subscription');
const logger = require('../../utils/logger');
const open = require('amqplib');
const rabbitMQConnection = require('../../utils/messageQueue/rabbitMQConnector');
const orderQueue = 'order';
const orderRetryQueue = 'order-retry';
const orderEx = 'order';
const orderRetryEx = 'order-retry'; 


function changeSubscriptionStatus (req, res, next) {
    console.log(req.body.update);
    if (!req.body.update) {
        logger.warn(`changeSubscriptionStatus request has rejected as param is missing`);
        return res.status(400).json({ 
            status: 'failed',
            message: 'bad request' 
        });
    }
    Subscription.findOne({ subscriptionId: req.params.id })
    .then(subscription => {
        //console.log(subscription);
        if (!subscription) {
            logger.warn(`changeSubscriptionStatus request is failed | unknown subscription number`);
            return res.status(422).json({
                status: 'failed',
                message: 'unknown subscription number'
            });
        }
        if (subscription) {
            console.log(subscription);
            subscription.isActive = req.body.update.isActive;
            subscription.lastModified = Date.now();
            subscription.markModified('isActive');
            subscription.markModified('lastModified');

            if (req.body.update.isActive === false) {

                // dispatch cancelOrders action to queue
                open.connect(rabbitMQConnection()).then(connection => {
                    connection.createChannel()
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
                                subscriptionId: subscription.subscriptionId,
                            }
                            ch.publish(orderEx, '', Buffer.from(JSON.stringify(message)), { persistent: true });
                            ch.close().then(() => {
                                connection.close();

                                subscription.save().then(()=> {
                                    logger.info(`changeSubscriptionStatus request has processed | ${subscription.subscriptionId} has inactivated`);
                                    return res.status(200).json({
                                        status: 'success',
                                        subscriptionId: subscription.subscriptionId,
                                        message: 'subscription is paused'
                                    });
                                }).catch(next);
                            });
                            
                        })
                    });
                }).catch(next);
            }

            if (req.body.update.isActive === true) {
                // recreate deliverySchedules
                const newDeliverySchedule = subscription.setFirstDeliverySchedule(subscription.deliveryDay);
                subscription.deliverySchedules = [newDeliverySchedule];
                subscription.markModified('deliverySchedules');

                open.connect(rabbitMQConnection()).then(connection => {
                    connection.createChannel()
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
                                subscriptionId: subscription.subscriptionId,
                            }
                            ch.publish(orderEx, '', Buffer.from(JSON.stringify(message)), { persistent: true });
                            ch.close().then(() => {
                                connection.close();

                                subscription.save().then(()=> {
                                    logger.info(`changeSubscriptionStatus request has processed | ${subscription.subscriptionId} has activated`);
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
            //return res.status(200).end();
        }
        
    }).catch(next);
}

module.exports = changeSubscriptionStatus;