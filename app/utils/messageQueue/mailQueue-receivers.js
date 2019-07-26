const mailQueue = 'mail';
const mailRetryQueue = 'mail-retry';
const open = require('amqplib');
const rabbitMQConnection = require('./rabbitMQConnector');
const logger = require('../logger');
const axiosSendGrid = require('../../../axios-sendgrid');
const axiosSlackSendgrid = require('../../../axios-slack-sendgrid');
const Subscription = require('../../models/Subscription');

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
                    console.log('mail message');
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
                                            console.log(response);
                                            if (response.status === 202) {
                                                subscription.save();
                                                ch.ack(msg);
                                                logger.info(`welcome email has delivered | subscriptionId: ${message.subscriptionId} email: ${message.email}`);
                                                return;
                                            }
                                        }).catch((error) => {

                                            if (error) {
                                                const payload = {
                                                    text: `${emailType} email delivery has failed`,
                                                    attachments: [
                                                        {
                                                            fallback: "Investigate undelivered email issue",
                                                            author_name: "Chokchok",
                                                            title: "Please investigate cause of delivery failure",
                                                            text: JSON.stringify(error.response)
                                                        }
                                                    ]
                                                }

                                                axiosSlackSendgrid.post('', payload)
                                                .then((response) => {
                                                    if (response.status === 200) {
                                                        logger.info('error messaage has posted to Slack channel');
                                                    }
                                                }).catch((error) => {
                                                    if (error) {
                                                        logger.warn(`failed to post error message to Slack`);
                                                    }
                                                });

                                                logger.warn(`welcome email delivery has failed | subscriptionId: ${message.subscriptionId} email: ${message.email}`);
                                                return ch.nack(msg, false, false);
                                            }

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
                                senderName: 'Chokchok V.O.F',
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
                                console.log(response);
                                if (response.status === 202) {
                                    ch.ack(msg);
                                    logger.info(`password reset email has delivered | ${message.email}`);
                                    return;
                                }
                            }).catch((error) => {

                                if (error) {
                                    const payload = {
                                        text: `${emailType} email delivery has failed`,
                                        attachments: [
                                            {
                                                fallback: "Investigate undelivered email issue",
                                                author_name: "Chokchok",
                                                title: "Please investigate cause of delivery failure",
                                                text: JSON.stringify(error.response)
                                            }
                                        ]
                                    }

                                    axiosSlackSendgrid.post('', payload)
                                    .then((response) => {
                                        if (response.status === 200) {
                                            logger.info('error messaage has posted to Slack channel');
                                        }
                                    }).catch((error) => {
                                        if (error) {
                                            logger.warn(`failed to post error message to Slack`);
                                        }
                                    });

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
                                senderName: 'Chokchok V.O.F',
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
                                console.log(response);
                                if (response.status === 202) {
                                    ch.ack(msg);
                                    logger.info(`password reset-nouser email has devliered | ${message.email}`);
                                    return;
                                }
                            }).catch((error) => {

                                if (error) {
                                    const payload = {
                                        text: `${emailType} email delivery has failed`,
                                        attachments: [
                                            {
                                                fallback: "Investigate undelivered email issue",
                                                author_name: "Chokchok",
                                                title: "Please investigate cause of delivery failure",
                                                text: JSON.stringify(error.response)
                                            }
                                        ]
                                    }

                                    axiosSlackSendgrid.post('', payload)
                                    .then((response) => {
                                        if (response.status === 200) {
                                            logger.info('error messaage has posted to Slack channel');
                                        }
                                    }).catch((error) => {
                                        if (error) {
                                            logger.warn(`failed to post error message to Slack`);
                                        }
                                    });

                                    logger.warn(`password reset-nouser email delivery has failed | ${message.email}`);
                                    return ch.nack(msg, false, false);
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