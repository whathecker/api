const queue = 'notification';
const retryQueue = 'notification-retry';
const mailQueue = 'mail';
const mailRetryQueue = 'mail-retry';
const open = require('amqplib')
const Order = require('../../models/Order');
const User = require('../../models/User');
const Billing =  require('../../models/Billing');
const rabbitMQConnection = require('./rabbitMQConnector');
const logger = require('../logger');
const axiosSendGrid = require('../../../axios-sendgrid');
const Subscription = require('../../models/Subscription');

function processNotificationCheckout (notification, order) {
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

        if (order.paymentStatus.status === "OPEN" || order.paymentStatus.status === "PENDING") {
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

    } 

    else if (eventCode === "AUTHORISATION" && isSuccess === "false") {
        const failedReason = notification.notificationItems[0].NotificationRequestItem.reason;

        if (failedReason === "REFUSED") {
            const paymentStatusUpdate = { status: 'REFUSED' };
            const orderStatusUpdate = { status: 'OVERDUE' };

            if (order.paymentStatus.status === "OPEN" || order.paymentStatus.status === "PENDING") {
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
    } 
    
    // refactor this part
    else if (eventCode === "RECURRING_CONTRACT" && isSuccess === "true") {
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

                Billing.findById(billingId)
                .then((billingOption) => {
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

    else if ((eventCode === "REFUND" || eventCode === "CANCELLATION" || eventCode === "CANCEL_OR_REFUND") && isSuccess === "true") {
        const orderStatus = order.orderStatus.status;
        const paymentStatus = order.paymentStatus.status;
        
        // payment status is only updated to REFUNDED or CANCELLED
        // when prev status is OPEN or AUTHORIZED or PENDING
        if (paymentStatus === "OPEN" || paymentStatus === "AUTHORIZED" || paymentStatus === "PENDING") {
            let nextPaymentStatus;
            (eventCode === "REFUND")? nextPaymentStatus = { status: "REFUNDED" } : null;
            (eventCode === "CANCELLATION")? nextPaymentStatus = { status: "CANCELLED" } : null;

            if (eventCode === "CANCEL_OR_REFUND") {
                const moditicationType = notification.notificationItems[0].NotificationRequestItem.additionalData['modification.action'];
                (moditicationType === "cancel")? nextPaymentStatus = { status: "CANCELLED" } : null;
                (moditicationType === "refund")? nextPaymentStatus = { status: "REFUNDED" } : null;
            }

            order.paymentStatus = nextPaymentStatus;
            order.paymentHistory.push(nextPaymentStatus);
            order.markModified('paymentStatus');
            order.markModified('paymentHistory');
            logger.info(`${order.orderNumber} | new paymentStatus updated ${order.paymentStatus}`);
            logger.info(`${order.orderNumber} | new paymentHistory updated ${order.paymentHistory}`);

            // order status is only updated to CANCELLED 
            // when prev status is RECEIVED or PENDING or PAID
            if (orderStatus === "RECEIVED" || orderStatus === "PENDING" || orderStatus === "PAID") {
                const nextOrderStatus = { status: "CANCELLED" };
                order.orderStatus = nextOrderStatus;
                order.orderStatusHistory.push(nextOrderStatus);
                order.markModified('orderStatus');
                order.markModified('orderStatusHistory');
                logger.info(`${order.orderNumber} | new orderStatus updated ${order.orderStatus}`);
                logger.info(`${order.orderNumber} | new orderStatusHistory updated ${order.orderStatusHistory}`);
            }

            return order.save().then((order) =>{
                logger.info(`${order.orderNumber} | process refund notification and save in db`);
            }).catch(console.warn);
        }

        
    }

    else if ((eventCode === "REFUND" || eventCode === "CANCELLATION" || eventCode === "CANCEL_OR_REFUND") && isSuccess === "false") {
        logger.warn(`refund or cancelled fail notification has received | ${order.orderNumber}`);
        return;
    }

    else {
        console.log('unknonw eventCode, log this somewhere!!!');
    }
}

function processNotificationNonCheckout (notification, billingOption) {
    const eventCode = notification.notificationItems[0].NotificationRequestItem.eventCode;
    const isSuccess = notification.notificationItems[0].NotificationRequestItem.success;
    console.log(eventCode);
    console.log(isSuccess);

    

    if (eventCode === "AUTHORISATION" && isSuccess === "true") {
        logger.info(`AUTHORISATION event has received | ${billingOption.billingId} | ${billingOption.recurringDetail}`);
        /* 
        const recurringDetail = notification.notificationItems[0].NotificationRequestItem.pspReference;
        const paymentMethodType = notification.notificationItems[0].NotificationRequestItem.paymentMethod;
        billingOption.recurringDetail = recurringDetail;
        billingOption.type = paymentMethodType;
        billingOption.markModified('type');
        billingOption.markModified('recurringDetail');
        billingOption.save(); */
        return;
    } 

    if (eventCode === "RECURRING_CONTRACT" && isSuccess === "true") {
        const recurringDetail = notification.notificationItems[0].NotificationRequestItem.pspReference;
        const paymentMethodType = notification.notificationItems[0].NotificationRequestItem.paymentMethod;
        billingOption.recurringDetail = recurringDetail;
        billingOption.type = paymentMethodType;
        billingOption.markModified('type');
        billingOption.markModified('recurringDetail');
        billingOption.save();
        logger.info(`RECURRING_CONTRACT event has received and recurringDetail and paymentMethodType has updated | ${billingOption.billingId} | ${billingOption.recurringDetail}`);
        return;
    }

    else if (eventCode === "RECURRING_CONTRACT" && isSuccess === "false") {
        const failedReason = notification.notificationItems[0].NotificationRequestItem.reason;

        if (failedReason === "REFUSED") {
            logger.info(`RECURRING_CONTRACT failed event has received | removing ${billingOption.billingId}`);
            billingOption.remove();
            return;
        }

        return
    }

    else if (eventCode === "AUTHORISATION" && isSuccess === "false") {
        const failedReason = notification.notificationItems[0].NotificationRequestItem.reason;

        if (failedReason === "REFUSED") {
            logger.info(`AUTHORISATION failed event has received | removing ${billingOption.billingId}`);
            billingOption.remove();
            return;
        }
        return;
    }

    else if ((eventCode === "REFUND" || eventCode === "CANCELLATION" || eventCode === "CANCEL_OR_REFUND") && isSuccess === "true") {
        const tokenRefundStatus = billingOption.tokenRefundStatus;
        
        if (tokenRefundStatus === "NOT_REQUIRED") {
            logger.warn(`receive refund notification for billing option has "NOT_REQUIRED" as tokenRefundStatus. request will be processed | ${billingOption.billingId}`)
        }
        if (tokenRefundStatus !== "REFUNDED") {
            billingOption.tokenRefundStatus = "REFUNDED";
            billingOption.markModified('tokenRefundStatus');
            billingOption.save();
            return;
        }

        if (tokenRefundStatus === "REFUNDED") {
            logger.warn(`receive refund notification, but token has refunded already | ${billingOption.billingId}`);
            return;
        }

    }

    else if ((eventCode === "REFUND" || eventCode === "CANCELLATION" || eventCode === "CANCEL_OR_REFUND") && isSuccess === "false") {
        logger.warn(`refund failed notification is received for ${billingOption.billingId}, tokenRefundStatus ${billingOption.tokenRefundStatus}`);
        return;
    }

    else {
        console.log('unknown notification type');
    }


}

/**
 * private function: convertDeliveryFrequency
 * @param {Number} deliveryFrequency
 * Return string representation of deliveryFrequency 
 * In order to display readable value at Welcome transactional email
 */

function convertDeliveryFrequency (deliveryFrequency) {
    let convertedValue = null;

    (deliveryFrequency === 7)? convertedValue = 'Weekly': null;
    (deliveryFrequency === 14)? convertedValue = 'Bi-weekly': null;
    (deliveryFrequency === 28)? convertedValue = 'Monthly' : null;

    return convertedValue;
}

/**
 * private function: convertDeliveryMonth
 * @param {Number} deliveryMonth
 * Return string representation of deliveryMonth
 * In order to display readable value at Welcome transactional email
 */

function convertDeliveryMonth (deliveryMonth) {
    let converedValue = null;

    (deliveryMonth === 0)? converedValue = 'Jan': null;
    (deliveryMonth === 1)? converedValue = 'Feb': null;
    (deliveryMonth === 2)? converedValue = 'Mar': null;
    (deliveryMonth === 3)? converedValue = 'Apr': null;
    (deliveryMonth === 4)? converedValue = 'May': null;
    (deliveryMonth === 5)? converedValue = 'Jun': null;
    (deliveryMonth === 6)? converedValue = 'Jul': null;
    (deliveryMonth === 7)? converedValue = 'Aug': null;
    (deliveryMonth === 8)? converedValue = 'Sep': null;
    (deliveryMonth === 9)? converedValue = 'Oct': null;
    (deliveryMonth === 10)? converedValue = 'Nov': null;
    (deliveryMonth === 10)? converedValue = 'Dec': null;

    return converedValue;
}

/**
 * private function: convertDeliveryDay
 * @param {Number} deliveryDay
 * Return string representation of deliveryDay
 * In order to display readable value at Welcome transactional email
 */

 function convertDeliveryDay (deliveryDay) {
     let convertedValue = null;

     (deliveryDay === 0)? convertedValue = 'Sunday' : null;
     (deliveryDay === 1)? convertedValue = 'Monday' : null;
     (deliveryDay === 2)? convertedValue = 'Tuesday' : null;
     (deliveryDay === 3)? convertedValue = 'Wednesday' : null;
     (deliveryDay === 4)? convertedValue = 'Thursday' : null;
     (deliveryDay === 5)? convertedValue = 'Friday' : null;
     (deliveryDay === 6)? convertedValue = 'Saturday' : null;

     return convertedValue;
 } 


// message consumer listening to adyen
function startMQConnection () {
    open.connect(rabbitMQConnection()).then((connection) => {
    return connection.createChannel();
    }).then((ch) => {
        const workQueue = ch.assertQueue(queue, {
            deadLetterExchange: retryQueue
        });
        const retryWorkQueue = ch.assertQueue(retryQueue, {
            deadLetterExchange: queue,
            messageTtl : 300000
        });

        const mailWorkQueue = ch.assertQueue(mailQueue, {
            deadLetterExchange: mailRetryQueue,
        });
        
        const mailRetryWorkQueue = ch.assertQueue(mailRetryQueue, {
            deadLetterExchange: mailQueue,
            messageTtl: 300000
        });

        // notificiation consumer
        Promise.all([
            workQueue,
            retryWorkQueue
        ]).then((ok) => {
            return ch.consume(queue, (msg) => {

                if (msg !== null) {
                    const message = JSON.parse(msg.content);
                    console.log(message);
                    console.log(message.notificationItems[0]);
                    // refactor this part
                    const merchanRef = message.notificationItems[0].NotificationRequestItem.merchantReference;
                    console.log(merchanRef);
                    console.log(merchanRef.length);

                    // merchantRef is orderNumber when it's 14 digits
                    // active order notification use orderNumber as merchantRef
                    if (merchanRef.length === 14) {
                        Order.findOne({ orderNumber: merchanRef })
                        .then((order) => {
                            if (order) {
                                console.log(order);
                                processNotificationCheckout(message, order);
                                return ch.ack(msg);
                            } else if (!order && msg.properties.headers['x-death']){
                                console.log(msg);
                                console.log(msg.properties.headers);
                                const retryCount = msg.properties.headers['x-death'][0].count;
                                if (retryCount <= 5) {
                                    return ch.nack(msg, false, false);
                                } else {
                                    logger.warn(`${orderNumber} | tried to deliver notification 5 times, but failed`);
                                    return ch.ack(msg);
                                }
                            } else {
                                // reject for first time processing attempt
                                return ch.nack(msg, false, false);
                            }
                        }).catch(console.warn);
                    }

                    // merchantRef is userId when it's 13 digits
                    // add/update/delete of billingOption use userId as merchantRef
                    if (merchanRef.length === 13) {
                        Billing.findOne({ billingId: merchanRef })
                        .then((billingOption) => {
                            console.log(billingOption);

                            if (billingOption) {
                                processNotificationNonCheckout(message, billingOption);
                                return ch.ack(msg);
                            } else if (!billingOption && msg.properties.headers['x-death']) {
                                const retryCount = msg.properties.headers['x-death'][0].count;
                                if (retryCount <= 5) {
                                    return ch.nack(msg, false, false);
                                } else {
                                    return ch.ack(msg);
                                }
                            } else {
                                return ch.nack(msg, false, false);
                            }
                        }).catch(console.warn);
                    }
                        
                }
            });;
        })

        // consumer for transactional mail delivery 
        Promise.all([
            mailWorkQueue,
            mailRetryWorkQueue
        ]).then((ok) => {
            return ch.consume(mailQueue, (msg) => {
                if (msg !== null) {
                    console.log('mail message');
                    console.log(msg);
                    const message = JSON.parse(msg.content);
                    const emailType = message.emailType;
                    
                    console.log(message);
                    let payloadToSendGrid = {
                        from: {
                            email: 'chokchok@hellochokchok.com'
                        }, 
                        personalizations: [{
                                to: [{
                                    email: message.email
                                }],
                                dynamic_template_data: {}
                        }],
                        template_id: null
                    };

                    switch (emailType) {
                        case 'welcome':
                            Subscription.findOne({ subscriptionId: message.subscriptionId })
                            .then((subscription) => {
                                if (subscription) {

                                    // update status of email sent to true
                                    if (subscription.isWelcomeEmailSent === false) {
                                        subscription.isWelcomeEmailSent = true;
                                        subscription.markModified('isWelcomeEmailSent');

                                        // update payload 
                                        payloadToSendGrid.template_id = "d-7b71a08e6e164c4e92624d174fb1c826";
                                        payloadToSendGrid.personalizations[0].dynamic_template_data = {
                                            subscriptionId: message.subscriptionId,
                                            packageName: message.packageName,
                                            price: message.price,
                                            firstName: message.firstName,
                                            lastName: message.lastName,
                                            shippingAddress: message.shippingAddress,
                                            billingAddress: message.billingAddress,
                                            paymentMethodType: message.paymentMethodType,
                                            paymentMethodRef: message.paymentMethodRef,
                                            deliveryFrequency: convertDeliveryFrequency(message.deliveryFrequency),
                                            deliveryDay: convertDeliveryDay(message.firstDeliverySchedule.day),
                                            deliveryDate: message.firstDeliverySchedule.date,
                                            deliveryMonth: convertDeliveryMonth(message.firstDeliverySchedule.month),
                                            deliveryYear: message.firstDeliverySchedule.year,
                                            senderName: 'Chokchok V.O.F',
                                            senderAddress: 'Commelinestraat 42',
                                            senderCity: 'Amsterdam',
                                            senderCountry: 'Netherlands',
                                            loginLink: ''
                                        }

                                        if (process.env.NODE_ENV === "production") {
                                            payloadToSendGrid.personalizations[0].dynamic_template_data.loginLink = 'https://www.hellochokchok.com/login';
                                        } else {
                                            payloadToSendGrid.personalizations[0].dynamic_template_data.loginLink = 'https://test.hellochokchok.com/login';
                                        }
                                        

                                        axiosSendGrid.post('/mail/send', payloadToSendGrid)
                                        .then((response) => {
                                            console.log(response);
                                            if (response.status === 202) {
                                                subscription.save();
                                                ch.ack(msg);
                                                logger.info(`welcome email has delivered | subscriptionId: ${message.subscriptionId} email: ${message.email}`);
                                                return;
                                            }
                                        }).catch((error) => {
                                            logger.warn(`welcome email delivery has failed | subscriptionId: ${message.subscriptionId} email: ${message.email}`);
                                            error? ch.nack(msg, false, false): null;
                                            return;
                                        });
                                    }

                                    else if (subscription.isWelcomeEmailSent === true) {
                                        logger.info(`welcome email has already delivered | subscriptionId: ${message.subscriptionId} email: ${message.email}`);
                                        ch.ack(msg);
                                        return;
                                    }

                                    // save update to DB and call sendGrid
                                }
                                if (!subscription) {
                                    
                                    if (msg.properties.headers['x-death']) {
                                        const retryCount = msg.properties.headers['x-death'][0].count;

                                        if (retryCount <= 5) {
                                            logger.warn(`welcome email delivery has rejected as subscription has not found | retry count ${retryCount}`);
                                            return ch.nack(msg, false, false)
                                        } else {
                                            logger.warn(`welcome email delivery has failed as subscrption has not found | message has acknowledged as retry count exceed 5`);
                                            return ch.ack(msg);
                                        }
                                        
                                    } else {
                                        // reject when subscription isn't found
                                        logger.warn(`welcome email delivery has rejected as subscription has not found | retry count: 0`);
                                        return ch.nack(msg, false, false);
                                    }
                                    
                                } 
                            }).catch(console.warn);

                        break;

                        case 'forgotpwd':
                            payloadToSendGrid.template_id = "d-701faee00c044eceb0cba00657666695";
                            payloadToSendGrid.personalizations[0].dynamic_template_data = {
                                firstName: message.firstName,
                                resetLink: '',
                                senderName: 'Chokchok V.O.F',
                                senderAddress: 'Commelinestraat 42',
                                senderCity: 'Amsterdam',
                                senderCountry: 'Netherlands'
                            }

                            if (process.env.NODE_ENV === "production") {
                                payloadToSendGrid.personalizations[0].dynamic_template_data.resetLink = `https://www.hellochokchok.com/login/resetpassword/${message.pwdResetToken}`
                            } else {
                                payloadToSendGrid.personalizations[0].dynamic_template_data.resetLink = `https://test.hellochokchok.com/login/resetpassword/${message.pwdResetToken}`
                            }

                            axiosSendGrid.post('/mail/send', payloadToSendGrid)
                            .then((response) =>{
                                console.log(response);
                                if (response.status === 202) {
                                    ch.ack(msg);
                                    logger.info(`password reset email has delivered | ${message.email}`);
                                    return;
                                }
                            }).catch((error) => {
                                logger.warn(`password reset email delivery has failed | ${message.email}`);
                                error? ch.nack(msg, false, false): null;
                                return;
                            });
                        break;

                        case 'forgotpwdnouser':
                            payloadToSendGrid.template_id = "d-1bd7cb0f47404e42aa9b9a9d714ace38";
                            payloadToSendGrid.personalizations[0].dynamic_template_data = {
                                email: message.email,
                                forgotPwdLink: '',
                                senderName: 'Chokchok V.O.F',
                                senderAddress: 'Commelinestraat 42',
                                senderCity: 'Amsterdam',
                                senderCountry: 'Netherlands'
                            }

                            if (process.env.NODE_ENV === "production") {
                                payloadToSendGrid.personalizations[0].dynamic_template_data.forgotPwdLink = `https://www.hellochokchok.com/login/forgotpassword`
                            } else {
                                payloadToSendGrid.personalizations[0].dynamic_template_data.forgotPwdLink = `https://test.hellochokchok.com/login/forgotpassword`
                            }
                            
                            axiosSendGrid.post('/mail/send', payloadToSendGrid)
                            .then((response) => {
                                console.log(response);
                                if (response.status === 202) {
                                    ch.ack(msg);
                                    logger.info(`password reset-nouser email has devliered | ${message.email}`);
                                    return;
                                }
                            }).catch((error) => {
                                logger.warn(`password reset-nouser email delivery has failed | ${message.email}`);
                                error? ch.nack(msg, false, false): null;
                                return;
                            });
                        break;
                    }
                }
            });
        });


    }).catch((error) => {
        console.log('retry to connect rabbitmq because rabbitmq might not started yet');
        if (error) {
            return setTimeout(startMQConnection, 15000);
        }
    });
}

startMQConnection();
 


