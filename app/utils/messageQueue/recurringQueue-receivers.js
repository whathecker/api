const recurringQueue = 'recurring';
const recurringRetryQueue = 'recurring-retry';
const open = require('amqplib');
const rabbitMQConnection = require('../messageQueue/rabbitMQConnector');
const async = require('async');
const axiosAdyen = require('../../../axios-adyen');
const logger = require('../logger');
const Order = require('../../models/Order');


function convertPriceToAdyenFormat (price) {
    const splitedPrice = price.split('.');
    let converted = '';

    for (let i = 0; i < splitedPrice.length; i++) {
        converted += splitedPrice[i];
    }

    return parseInt(converted);
}

function convertCurrencyToAdyenFormat (currency) {
    if (currency === 'euro') {
        return 'EUR'
    } else {
        return Error('unexpected currency value');
    }
}

function startMQConnection () {
    open.connect(rabbitMQConnection())
    .then(connection => {
        return connection.createChannel();
    })
    .then(ch => {
        const recurringWorkQueue = ch.assertQueue(recurringQueue, {
            deadLetterExchange: recurringRetryQueue
        });
        
        const recurringRetryWorkQueue = ch.assertQueue(recurringRetryQueue, {
            deadLetterExchange: recurringQueue,
            messageTtl: 300000
        });

        Promise.all([
            recurringWorkQueue, 
            recurringRetryWorkQueue
        ]).then(()=> {
            return ch.consume(recurringQueue, (msg) => {
                if (msg !== null) {
                    const message = JSON.parse(msg.content);
                    const actionType = message.action;
                    const orders = message.orders;
                    const attemptNum = message.attempt;
                    console.log(message);

                    if (actionType === 'payment') {

                        async.each(orders, (order, callback) => {
                            
                            const payload = {
                                amount: {
                                    value: convertPriceToAdyenFormat(order.orderAmount.totalAmount),
                                    currency: convertCurrencyToAdyenFormat(order.orderAmount.currency)
                                },
                                paymentMethod: {
                                    recurringDetailReference: order.paymentMethod.recurringDetail
                                },
                                reference: order.orderNumber,
                                merchantAccount: 'ChokchokNL',
                                returnUrl: 'https://www.hellochokchok.com', /** returnUrl isnt used */
                                shopperReference: order.userId,
                                shopperInteraction: 'ContAuth'
                            }

                            axiosAdyen.post('/payments', payload)
                            .then(response => {
                                const resultCode = response.data.resultCode;
                                if (response.status === 200 && resultCode === "Authorised") {
                                    logger.info(`recurring payment ${order.orderNumber} has been authorised`);

                                    Order.findOne({ orderNumber: order.orderNumber })
                                    .then(order => {
                                        const orderStatus = { status: "PAID" };
                                        const paymentStatus = { status: "AUTHORIZED" };
                                        order.orderStatus = orderStatus;
                                        order.paymentStatus = paymentStatus;
                                        order.orderStatusHistory.push(orderStatus);
                                        order.paymentHistory.push(paymentStatus);
                                        order.markModified('orderStatus');
                                        order.markModified('paymentStatus');
                                        order.markModified('orderStatusHistory');
                                        order.markModified('paymentHistory');
                                        order.save();
                                        callback();
                                    })
                                    .catch((error) => {
                                        //console.log(error);
                                        callback(error);
                                    });
                                }

                                if (resultCode !== "Authorised" && attemptNum === "7") {
                                    // change status to overdue
                                    Order.findOne({ orderNumber: order.orderNumber })
                                    .then(order => {
                                        const orderStatus = { status: "OVERDUE" };
                                        order.orderStatus = orderStatus;
                                        order.orderStatusHistory.push(orderStatus);
                                        order.markModified('orderStatus');
                                        order.markModified('orderStatusHistory');
                                        order.save();
                                        callback();
                                    })
                                    .catch((error) => {
                                        //console.log(error);
                                        callback(error);
                                    });
                                }
                            })
                            .catch((error) => {
                                logger.error(`recurring payment attempt for ${order.orderNumber} got error from Adyen | ${error}`);
                                callback(error);
                            })
                           
                        }, (error) => {
                            if (error) {
                                console.log(error);
                                logger.error(`error(s) in recurring batch process | attempt Num: ${attemptNum} | ${orders.length - 1} orders have processed`);
                                return ch.ack(msg);
                            } else {
                                logger.info(`recurring batch have processed | attempt Num: ${attemptNum} | ${orders.length - 1} orders have processed`);
                                return ch.ack(msg);
                            }
                        });
                        
                    }
                }
            });
        });
    }).catch(error => {
        if (error) {
            console.log('error in connecting to rabbitMQ for inventory receivers');
            return setTimeout(startMQConnection, 15000);
        }
    })
}

startMQConnection();