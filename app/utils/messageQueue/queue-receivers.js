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
                    const orderNumber = message.notificationItems[0].NotificationRequestItem.merchantReference;

                    Order.findOne({ orderNumber: orderNumber })
                    .then((order) => {
                        if (order) {
                            console.log(order);
                            processNotification(message, order);
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
 


