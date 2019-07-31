const Subscription = require('../../models/Subscription');
const Order = require('../../models/Order');
const logger = require('../../utils/logger');
const async = require('async');
const open = require('amqplib');
const rabbitMQConnection = require('../../utils/messageQueue/rabbitMQConnector');
const recurringQueue = 'recurring';
const recurringRetryQueue = 'recurring-retry';
const recurringEx = 'recurring';
const recurringRetryEx = 'recurring-retry';


function initiateRecurringProcess (req, res, next) {
    
    const attempt = req.params.attempt;
    const currentDate = Date.now();
    const dayInMsec = 86400000;
    let interval;
    
    switch (attempt) {
        case "1" :
            interval = 7 * dayInMsec;
            break;
        case "2" :
            interval = 6 * dayInMsec;
            break;
        case "3": 
            interval = 5 * dayInMsec;
            break;
        case "4":
            interval = 4 * dayInMsec;
            break;
        case "5":
            interval = 3 * dayInMsec;
            break;
        case "6": 
            interval = 2 * dayInMsec;
            break;
        case "7" :
            interval = 1 * dayInMsec;
            break;
        default: 
            console.log('unknonw attempt id');
            return res.status(422).json({
                status: 'failed',
                message: 'unknown attempt id'
            });
    }

    const deliverySchedule = new Date(currentDate + interval);
    const deliveryMonth = deliverySchedule.getMonth();
    const deliveryYear = deliverySchedule.getFullYear();
    const deliveryDate = deliverySchedule.getDate();
    
    //console.log(deliverySchedule);
    //console.log(deliveryDate);
    //console.log(deliveryMonth);
    //console.log(deliveryYear);
    Subscription.find({
        /*
        'nextDeliverySchedule.year': deliveryYear,
        'nextDeliverySchedule.month': deliveryMonth,
        'nextDeliverySchedule.date': deliveryDate,
        isActive: true */
    })
    .then(subscriptions => {
    
        if (subscriptions.length === 0) {
            logger.warn(`initiateRecurringProcess request has failed | no subscriptions found`);
            return res.status(200).json({
                status: 'success',
                result: 'No_result',
                message: 'No subscrption to initiate recurring process'
            });
        }
        if (subscriptions.length !== 0) {
            

            let orderBatch = [];

            async.each(subscriptions, (subscription, callback) => {
                
                
                const orderNumber = subscription.nextDeliverySchedule.orderNumber;
                const isProcessed = subscription.nextDeliverySchedule.isActive;
                //const isActive = subscription.nextDeliverySchedule.isActive;

                if (isProcessed === true) {
                    logger.warn(`initiateRecurringProcess | skip ${subscription.subscriptionId} in the process | nextDeliverySchedule is marked as processed`);
                    callback();
                }
                /*
                if (isActive === false) {
                    logger.warn(`initiateRecurringProcess | skip ${subscription.subscriptionId} in the process | nextDeliverySchedule is inactive`);
                    callback();
                } */
                if (orderNumber === '') {
                    // orderNumber is updated when prev order is shipped
                    // when orderNumber is '' that means prev order isn't shipped
                    // thus when orderNumber is '', it's not included in recurring batch
                    logger.warn(`initiateRecurringProcess | skip ${subscription.subscriptionId} in the process | orderNumber has not assigned to next delivery schedule | check if first delivery has delivered`);
                    callback();
                }
                
                if (orderNumber !== '') {
                    Order.findOne({ orderNumber: orderNumber })
                    .populate('user', 'userId')
                    .then(order => {
                        if (order) {
                            const orderStatus = order.orderStatus.status;

                            // orders are batched only when status is either RECEIVED or OVERDUE
                            if (orderStatus === "RECEIVED" || orderStatus === "OVERDUE") {
                                const orderToProcess = {
                                    orderNumber: order.orderNumber,
                                    paymentMethod: order.paymentMethod,
                                    orderAmountPerItem: order.orderAmountPerItem,
                                    orderAmount: order.orderAmount,
                                    userId: order.user.userId
                                }
                                orderBatch.push(orderToProcess);
                            }       
                        }
                        callback();
                    })
                    .catch(error => {
                        error? next(error) : null;
                    });

                }
                
            }, (error) => {
                if (error) {
                    next(error);
                }
                
                // send the orderBatch to MQ
                open.connect(rabbitMQConnection()).then(connection => {
                    connection.createChannel()
                    .then(ch => {
                        const exchange = ch.assertExchange(recurringEx, 'direct', { durable: true});
                        const retryExchange = ch.assertExchange(recurringRetryEx, 'direct', { durable: true });
                        const bindQueue = ch.bindQueue(recurringQueue, recurringEx);
                        const bindRetryQueue = ch.bindQueue(recurringRetryQueue, recurringRetryEx);

                        Promise.all([
                            exchange,
                            retryExchange,
                            bindQueue,
                            bindRetryQueue
                        ]).then(() => {

                            const message = {
                                action: 'payment',
                                attempt: req.params.attempt,
                                orders: orderBatch
                            }

                            ch.publish(recurringEx, '', Buffer.from(JSON.stringify(message)), { persistent: true });
                            ch.close().then(() => {
                                connection.close();
                                logger.warn(`initiateRecurringProcess has processed| ${orderBatch.length - 1} orders have been dispatched to recurring process`);
                                return res.status(200).json({
                                    status: 'success',
                                    orders: orderBatch,
                                    message: 'orders have batched to recurring process'
                                });
                            }).catch(next);
                        })

                    });

                }).catch(next);
                
            });
        
        }
    })
    .catch(next);
    
    
    
}

module.exports = initiateRecurringProcess;