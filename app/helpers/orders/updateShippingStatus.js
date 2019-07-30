const Order = require('../../models/Order');
const logger = require('../../utils/logger');
const Subscription = require('../../models/Subscription');
const open = require('amqplib');
const rabbitMQConnection = require('../../utils/messageQueue/rabbitMQConnector');
const orderQueue = 'order';
const orderRetryQueue = 'order-retry';
const orderEx = 'order';
const orderRetryEx = 'order-retry';

function updateShippingStatus (req, res, next) {
    //console.log(req.body.update);
    if (!req.body.update) {
        logger.warn(`updateShippingStatus request has rejected as param is missing`);
        return res.status(400).json({ 
            status: 'failed',
            message: 'bad request' 
        });
    }

    Order.findOne({ orderNumber: req.params.id })
    .populate({
        path: 'user',
        populate: { path: 'subscriptions' }
    })
    .then(order => {
        if (!order) {
            logger.warn(`updateShippingStatus request is failed | unknown order number`);
            return res.status(422).json({
                status: 'failed',
                message: 'unknown order number'
            });
        }
        if (order) {
            console.log(order);

            if (order.shippedAmountPerItem.length > 0) {
                order.courier = req.body.update.courier;
                order.trackingNumber = req.body.update.trackingNumber;
                order.isShipped = true;
                order.shippedDate =  Date.now();
                order.lastModified = Date.now();
                order.orderStatus = {
                    status: 'SHIPPED',
                    timestamp: Date.now()
                };
                const orderStatusInstance = order.orderStatus;
                order.orderStatusHistory.push(orderStatusInstance);
                order.markModified('orderStatusHistory');
                order.markModified('orderStatus');
                order.markModified('isShipped');
                order.markModified('lastModified');
                order.markModified('courier');
                order.markModified('trackingNumber');
                
                Subscription.findById(order.user.subscriptions[0]._id)
                .then(subscription => {
                    let deliverySchedules = Array.from(subscription.deliverySchedules);
                    deliverySchedules.forEach(e => {
                        if (e.orderNumber === order.orderNumber) {
                            e.isProcessed = true;
                        }
                    });

                    if (order.orderNumber === subscription.firstDeliverySchedule.orderNumber) {
                        subscription.firstDeliverySchedule.isProcessed = true;
                        subscription.markModified('firstDeliverySchedule');
                    }

                    subscription.deliverySchedules = deliverySchedules;
                    subscription.markModified('deliverySchedules');
                    
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
                                    actionType: 'createOrder',
                                    subscriptionId: order.user.subscriptions[0].subscriptionId,
                                    orderNumber: order.orderNumber
                                }
                                ch.publish(orderEx, '', Buffer.from(JSON.stringify(message)), { persistent: true });
                                ch.close().then(() => {
                                    connection.close();

                                    Promise.all([
                                        subscription.save(),
                                        order.save()
                                    ])
                                    .then(values => {
                                        return res.status(200).json({
                                            status: 'success',
                                            orderNumber: order.orderNumber,
                                            email: order.user.email,
                                            message: 'order is marked as shipped'
                                        });
                
                                    }).catch(next); 

                                });
                                
                            })
                        });
                    }).catch(next);
                    
                    

                }).catch(next);
                
               

            } else {
                logger.warn(`updateShippingStatus request is failed | no items packed yet`);
                return res.status(422).json({
                    status: 'failed',
                    message: "no items are packed for this order, finish packing first"
                }); 
            } 

        }

    }).catch(next);

}

module.exports = updateShippingStatus;