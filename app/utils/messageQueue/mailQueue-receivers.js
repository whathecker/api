const mailQueue = 'mail';
const mailRetryQueue = 'mail-retry';
const open = require('amqplib');
const rabbitMQConnection = require('./rabbitMQConnector');
const logger = require('../logger');
const axiosSendGrid = require('../../../axios-sendgrid');
const Subscription = require('../../models/Subscription');
const Order = require('../../models/Order');
const errorDispatchers = require('../errorDispatchers/errorDispatchers');
const async = require('async');
const jwt = require('jsonwebtoken');

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

/**
 * 
 * @param {array} trackingNums 
 * Convert array of tracking numbers to concatenated string
 */
function concatTrackingNums (trackingNums) {
    if (trackingNums.length === 1) {
        return `Tracking number: ${trackingNums[0]}`;
    }

    if (trackingNums.length > 1) {
        return trackingNums.reduce((accumulator, currentValue, index) => {
            if (index === 0) {
                return accumulator.concat('', currentValue);
            }

            if (index !== 0) {
                return accumulator.concat(', ', currentValue);
            }
            
        }, 'Tracking numbers: ');
    }
}


function startMQConnection () {
    open.connect(rabbitMQConnection())
    .then((connection) => {
        return connection.createChannel();
    })
    .then((ch) => {
        const mailWorkQueue = ch.assertQueue(mailQueue, {
            deadLetterExchange: mailRetryQueue,
        });
        
        const mailRetryWorkQueue = ch.assertQueue(mailRetryQueue, {
            deadLetterExchange: mailQueue,
            messageTtl: 300000
        });

        // consumer for transactional mail delivery 
        Promise.all([
            mailWorkQueue,
            mailRetryWorkQueue
        ]).then((ok) => {
            return ch.consume(mailQueue, (msg) => {
                if (msg !== null) {
                    //console.log('mail message');
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
                        case 'shippingConf':
                            Order.findOne({ orderNumber: message.orderNumber })
                            .populate({
                                path: 'user',
                                populate: { path: 'subscriptions defaultShippingAddress' }
                            })
                            .then(order => {

                                if (!order) {
                                    
                                    if (msg.properties.headers['x-death']) {
                                        const retryCount = msg.properties.headers['x-death'][0].count;

                                        if (retryCount <= 5) {
                                            logger.warn(`shippingConf email delivery has rejected as oirder has not found | retry count ${retryCount}`);
                                            return ch.nack(msg, false, false)
                                        } else {
                                            logger.warn(`shippingConf email delivery has failed as order has not found | message has acknowledged as retry count exceed 5`);
                                            // add Slack integration here
                                            return ch.ack(msg);
                                        }
                                        
                                    } else {
                                        // reject when subscription isn't found
                                        logger.warn(`shippingConf email delivery has rejected as order has not found | retry count: 0`);
                                        return ch.nack(msg, false, false);
                                    }
                                    
                                }

                                if (order) {
                                    console.log(order);
                                    order.isConfEmailDelivered = true;
                                    order.markModified('isConfEmailDelivered');
                                    const month = order.shippedDate.getMonth();
                                    const year = order.shippedDate.getFullYear();
                                    const date = order.shippedDate.getDate();
                                    const day = order.shippedDate.getDay();
                                    const postalCode = order.user.defaultShippingAddress.postalCode;

                                    payloadToSendGrid.template_id = "d-95693c68a6ea4683bc76bf72544d4f3e";
                                    payloadToSendGrid.personalizations[0].dynamic_template_data = {
                                        firstName: order.user.firstName,
                                        deliveryDate: `${convertDeliveryDay(day)} ${date} ${convertDeliveryMonth(month)} ${year}`,
                                        subscriptionId: order.user.subscriptions[0].subscriptionId,
                                        courier: order.courier,
                                        trackingNumbers: concatTrackingNums(order.trackingNumber),
                                        trackingLink: `https://www.dhlparcel.nl/nl/consument/volg-je-pakket?tc=${order.trackingNumber[0]}&pc=${postalCode}&lc=nl-NL`,
                                        senderName: 'V.O.F chokchok',
                                        senderAddress: 'Commelinstraat 42',
                                        senderCity: 'Amsterdam',
                                        senderCountry: 'Netherlands',
                                        loginLink: ''
                                    }

                                    if (process.env.NODE_ENV === "production") {
                                        payloadToSendGrid.personalizations[0].dynamic_template_data.loginLink = 'https://www.hellochokchok.com/login';
                                    } 
                                    if (process.env.NODE_ENV !== "production") {
                                        payloadToSendGrid.personalizations[0].dynamic_template_data.loginLink = 'https://test.hellochokchok.com/login';
                                    }

                                    axiosSendGrid.post('/mail/send', payloadToSendGrid)
                                    .then((response) => {
                                        //console.log(response);
                                        if (response.status === 202) {
                                            order.save();
                                            ch.ack(msg);
                                            logger.info(`shippingConf email has delivered | orderNumber: ${message.orderNumber} email: ${message.email}`);
                                            return;
                                        }
                                    }).catch((error) => {

                                        if (error) {
                                            errorDispatchers.dispatchSendGridEmailError(error, emailType);
                                            logger.warn(`shippongConf email delivery has failed | subscriptionId: ${message.orderNumber} email: ${message.email}`);
                                            return ch.nack(msg, false, false);
                                        }

                                    });
                                }
                            }).catch(console.warn);

                            break;
                            
                        case 'welcome':
                            Subscription.findOne({ subscriptionId: message.subscriptionId })
                            .then((subscription) => {
                                if (subscription) {

                                    if (subscription.isWelcomeEmailSent === true) {
                                        logger.info(`welcome email has already delivered | subscriptionId: ${message.subscriptionId} email: ${message.email}`);
                                        return ch.ack(msg);
                                    }

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
                                            senderName: 'V.O.F chokchok',
                                            senderAddress: 'Commelinstraat 42',
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
                                            //console.log(response);
                                            if (response.status === 202) {
                                                subscription.save();
                                                ch.ack(msg);
                                                logger.info(`welcome email has delivered | subscriptionId: ${message.subscriptionId} email: ${message.email}`);
                                                return;
                                            }
                                        }).catch((error) => {
                                            
                                            if (error) {
                                                errorDispatchers.dispatchSendGridEmailError(error, emailType);
                                                logger.warn(`welcome email delivery has failed | subscriptionId: ${message.subscriptionId} email: ${message.email}`);
                                                return ch.nack(msg, false, false);
                                            }
                                        });
                                    }

                                }
                                if (!subscription) {
                                    
                                    if (msg.properties.headers['x-death']) {
                                        const retryCount = msg.properties.headers['x-death'][0].count;

                                        if (retryCount <= 5) {
                                            logger.warn(`welcome email delivery has rejected as subscription has not found | retry count ${retryCount}`);
                                            return ch.nack(msg, false, false)
                                        } else {
                                            logger.warn(`welcome email delivery has failed as subscrption has not found | message has acknowledged as retry count exceed 5`);
                                            // add Slack integration here
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
                                senderName: 'V.O.F chokchok',
                                senderAddress: 'Commelinstraat 42',
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
                                //console.log(response);
                                if (response.status === 202) {
                                    logger.info(`password reset email has delivered | ${message.email}`);
                                    return ch.ack(msg);
                                }
                            }).catch((error) => {
                                if (error) {
                                    errorDispatchers.dispatchSendGridEmailError(error, emailType);
                                    logger.warn(`password reset email delivery has failed | ${message.email}`);
                                    return ch.nack(msg, false, false);
                                }
                            });
                            break;

                        case 'forgotpwdnouser':
                            payloadToSendGrid.template_id = "d-1bd7cb0f47404e42aa9b9a9d714ace38";
                            payloadToSendGrid.personalizations[0].dynamic_template_data = {
                                email: message.email,
                                forgotPwdLink: '',
                                senderName: 'V.O.F chokchok',
                                senderAddress: 'Commelinstraat 42',
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
                                //console.log(response);
                                if (response.status === 202) {
                                    logger.info(`password reset-nouser email has devliered | ${message.email}`);
                                    return ch.ack(msg);
                                }
                            }).catch((error) => {
                                if (error) {
                                    errorDispatchers.dispatchSendGridEmailError(error, emailType);
                                    logger.warn(`password reset-nouser email delivery has failed | ${message.email}`);
                                    return ch.nack(msg, false, false);
                                }
                            });
                            break;

                        case 'payment_reminder':
                            const orderBatch = message.orders;

                            let failedDelivery = [];
                            let successfulDelivery = [];

                            async.each(orderBatch, (order, callback) => {

                                // construct JWT and paymentLink
                                const tokenSecret = process.env.OVERDUE_ORDER_TOKEN_SECRET;
                                const overdueOrderToken = jwt.sign({
                                    userId: order.user.userId,
                                    email: order.user.email,
                                    orderNumber: order.orderNumber
                                }, tokenSecret);

                                let paymentLink;
                                let contactLink;
                                // construct contactLink
                                if (process.env.NODE_ENV === "production") {
                                    paymentLink = `https://www.hellochokchok.com/overduepayment?order=${overdueOrderToken}`;
                                    contactLink = 'https://www.hellochokchok.com/contact'
                                }

                                if (process.env.NODE_ENV !== "production") {
                                    //paymentLink = `https://test.hellochokchok.com/onlinepayment?order=${overdueOrderToken}`;
                                    //contactLink = 'https://test.hellochokchok.com/contact'
                                    paymentLink = `http://localhost:3000/overduepayment?order=${overdueOrderToken}`;
                                    contactLink = 'http://localhost:3000//contact'
                                }

                                let payload = {
                                    from: {
                                        email: 'chokchok@hellochokchok.com'
                                    }, 
                                    personalizations: [{
                                            to: [{
                                                email: order.user.email
                                            }],
                                            dynamic_template_data: {
                                                firstName: order.user.firstName,
                                                lastName: order.user.lastName,
                                                packageName: order.orderAmountPerItem[0].name,
                                                qty: order.orderAmountPerItem[0].quantity,
                                                price: order.orderAmount.totalAmount,
                                                paymentLink: paymentLink,
                                                contactLink: contactLink,
                                                senderName: 'V.O.F chokchok',
                                                senderAddress: 'Commelinstraat 42',
                                                senderCity: 'Amsterdam',
                                                senderCountry: 'Netherlands'
                                            }
                                    }],
                                    template_id: "d-a790dae99fec4c3daae227473207dc51"
                                };

                                axiosSendGrid.post('/mail/send', payload)
                                .then(response => {
                                    if (response.status === 202) {
                                        successfulDelivery.push(order.orderNumber);
                                        callback();
                                    } 
                                }).catch(error => {
                                    if (error) {
                                        errorDispatchers.dispatchSendGridEmailError(error, emailType);
                                        logger.warn(`payment reminder email delivery has failed | order number: ${order.orderNumber} email: ${order.user.email}`);
                                        failedDelivery.push(order.orderNumber);
                                        callback(error);
                                    }
                                });

                            }, (error) => {

                                errorDispatchers.dispatchReminderProcessStatus(orderBatch, successfulDelivery, failedDelivery);

                                if (error) {
                                    console.log(error);
                                    logger.error(`error(s) in recurring batch process| ${orderBatch.length} orders have processed`);
                                    // send message to Slack
                                    return ch.ack(msg);
                                } else {
                                    logger.info(`recurring batch have processed | ${orderBatch.length} orders have processed`);
                                    // send message to Slack
                                    return ch.ack(msg);
                                }

                            });
                            break;
                    }
                }
            });
        });

    }).catch((error) => {
        
        if (error) {
            console.log('error in connecting to rabbitMQ for mail receivers');
            return setTimeout(startMQConnection, 15000);
        }
        
    });

}

startMQConnection();