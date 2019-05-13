const queue = 'notification';
const retryQueue = 'notification-retry';
const open = require('amqplib')
const Order = require('../models/Order');
const User = require('../models/User');
const Billing =  require('../models/Billing');
const logger = require('../utils/logger');

function processNotification (notification, order) {
    console.log('process it');
    console.log(notification);
    console.log(notification.notificationItems[0]);
    const eventCode = notification.notificationItems[0].NotificationRequestItem.eventCode;
    const isSuccess = notification.notificationItems[0].NotificationRequestItem.success;
    console.log(eventCode);
    console.log(isSuccess);

    if (eventCode === "AUTHORISATION" && isSuccess === "true") {
        const paymentStatusUpdate = { status: 'AUTHORIZED'};
        const orderStatusUpdate = { status: 'PAID' };

        if (order.paymentStatus.status === "OPEN" ||
        order.paymentStatus.status === "PENDING") {
            // payment status is only updated to AUTHORIZED
            // when prev status is OPEN or PENDING
            order.paymentStatus = paymentStatusUpdate;
            order.markModified('paymentStatus');
            logger.info(`${order.orderNumber} | new paymentStatus updated ${order.paymentStatus}`);
            // order status and history in only updated to PAID
            // when prev payment status is OPEN or PENDING
            order.orderStatus = orderStatusUpdate;
            order.markModified('orderStatus');
            logger.info(`${order.orderNumber} | new orderStatus updated ${order.orderStatus}`);
            order.orderStatusHistory.push(order.orderStatus);
            order.markModified('orderStatusHistory');
            logger.info(`${order.orderNumber} | new orderStatusHistory updated ${order.orderStatusHistory}`);
        }
        // update payment status history
        // when payment status update didn't changed payment status
        // history is still saved for debugging purposes
        order.paymentHistory.push(paymentStatusUpdate);
        order.markModified('paymentHistory');
        logger.info(`${order.orderNumber} | new paymentHistory updated ${order.paymentHistory}`);

        // save updated document
        return order.save().then((order) => {
            logger.info(`${order.orderNumber} | updated order is saved in db`);
        }).catch(console.warn);

    } else if (eventCode === "AUTHORISATION" && isSuccess === "false") {
        const failedReason = notification.notificationItems[0].NotificationRequestItem.reason;

        if (failedReason === "REFUSED") {
            const paymentStatusUpdate = { status: 'REFUSED' };
            const orderStatusUpdate = { status: 'OVERDUE' };

            if (order.paymentStatus.status === "OPEN" ||
            order.paymentStatus.status === "PENDING"
            ) {
                // payment status is only updated to REFUSED
                // when prev status is OPEN or PENDING
                order.paymentStatus = paymentStatusUpdate;
                order.markModified('paymentStatus');
                logger.info(`${order.orderNumber} | new paymentStatus updated ${order.paymentStatus}`);
                // order status and history is only updated to OVERDUE
                // when prev payment status is OPEN or PENDING  
                order.orderStatus = orderStatusUpdate;
                order.markModified('orderStatus');
                logger.info(`${order.orderNumber} | new orderStatus updated ${order.orderStatus}`);
                order.orderStatusHistory.push(order.orderStatus);
                order.markModified('orderStatusHistory');
                logger.info(`${order.orderNumber} | new orderStatusHistory updated ${order.orderStatusHistory}`);
            }
            // update payment status history
            // when payment status update didn't changed payment status
            // history is still saved for debugging purposes
            order.paymentHistory.push(paymentStatusUpdate);
            order.markModified('paymentHistory');
            logger.info(`${order.orderNumber} | new paymentHistory updated ${order.paymentHistory}`);
            
            
            return order.save().then((order) => {
                logger.info(`${order.orderNumber} | updated order is saved in db`);
            }).catch(console.warn);
            
        }
    } else if (eventCode === "RECURRING_CONTRACT" && isSuccess === "true") {
        console.log('this is called');
        const recurringDetail = notification.notificationItems[0].NotificationRequestItem.pspReference;
        const paymentMethodType = notification.notificationItems[0].NotificationRequestItem.paymentMethod;
        const userReference = notification.notificationItems[0].NotificationRequestItem.additionalData.shopperReference;
        const userId = order.user;
        console.log(userId);
        order.paymentMethod.type = paymentMethodType;
        order.paymentMethod.recurringDetail = recurringDetail;
        order.markModified('paymentMethod');
        logger.info(`${order.orderNumber} | new paymentMethod updated ${order.paymentMethod}`);

        User.findById(userId).then((user) => {
            if (user) {
                console.log(user);

                const billingId = user.billingOptions;
                console.log(billingId);

                Billing.findById(billingId).then((billingOption) => {
                    if (billingOption) {
                        // update billingOption type and recurring detail
                        billingOption.type = paymentMethodType;
                        billingOption.recurringDetail = recurringDetail;
                        billingOption.markModified('type');
                        billingOption.markModified('recurringDetail');
                        logger.info(`${userReference} | new billingOption updated`);

                        // save order and billing to db 
                        Promise.all([
                            order.save(),
                            billingOption.save()
                        ])
                        .then((values)=> {
                            if (values) {
                                logger.info(`billing detail updated for ${order.orderNumber} | ${billingId}`);
                                return;
                            }
                        }).catch(console.warn);
                    }
                }).catch(console.warn);

            }
        }).catch(console.warn);
        
    }
}

// message consumer listening to adyen
function startMQConnection () {
    open.connect('amqp://rabbitmq:rabbitmq@rabbitmq:5672/').then((connection) => {
    return connection.createChannel();
    }).then((ch) => {
        const workQueue = ch.assertQueue(queue, {
            deadLetterExchange: retryQueue
        });
        const retryWorkQueue = ch.assertQueue(retryQueue, {
            deadLetterExchange: queue,
            messageTtl : 300000
        });

        Promise.all([
            workQueue,
            retryWorkQueue
        ]).then((ok) => {
            return ch.consume(queue, (msg) => {
                if (msg !== null) {
                    const message = JSON.parse(msg.content);
                    console.log(message);
                    const orderNumber = message.notificationItems[0].NotificationRequestItem.merchantReference;

                    Order.findOne({ orderNumber: orderNumber })
                    .then((order) => {
                        if (order) {
                            console.log(order);
                            processNotification(message, order);
                            ch.ack(msg);
                        } else if (!order && msg.properties.headers['x-death']){
                            console.log(msg);
                            console.log(msg.properties.headers);
                            const retryCount = msg.properties.headers['x-death'][0].count;
                            if (retryCount <= 5) {
                                ch.nack(msg, false, false);
                            } else {
                                logger.warn(`${orderNumber} | tried to deliver notification 5 times, but failed`);
                                ch.ack(msg);
                            }
                        } else {
                            // reject for first time processing attempt
                            ch.nack(msg, false, false);
                        }
                    }).catch(console.warn);
                }
            })
        })
    }).catch((error) => {
        console.log('retry to connect rabbitmq because rabbitmq might not started yet');
        if (error) {
            return setTimeout(startMQConnection, 15000);
        }
    });
}

startMQConnection();
 


