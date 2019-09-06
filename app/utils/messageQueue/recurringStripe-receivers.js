const recurringQueue = 'recurring';
const recurringRetryQueue = 'recurring-retry';
const open = require('amqplib');
const rabbitMQConnection = require('./rabbitMQConnector');
const async = require('async');
const logger = require('../logger');
const Order = require('../../models/Order');
const stripeHelpers = require('../stripe/stripeHelpers');
const stripe = require('stripe')(stripeHelpers.retrieveApikey());


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
                    const ordersBatch = message.orders;
                    const attemptNum = message.attempt;
                    console.log(message);

                    if (actionType === 'payment') {

                        async.each(ordersBatch, (order, callback) => {
                            
                            let paymentIntent;
                            
                            try {
                                paymentIntent = await stripe.paymentIntents.create({
                                    amount: stripeHelpers.convertAmountFormat(order.orderAmount.totalAmount),
                                    currency: stripeHelpers.convertCurrencyFormat(order.orderAmount.currency),
                                    payment_method_types: ['card'],
                                    customer: order.userId,
                                    payment_method: order.paymentMethod.recurringDetail,
                                    off_session: true,
                                    confirm: true
                                });
                            } catch {
                                callback(error);
                            }
                            

                            if (paymentIntent.status === "succeeded") {
                                logger.info(`recurring payment ${order.orderNumber} has been authorised`);

                                Order.findOne({ orderNumber: order.orderNumber })
                                .then(order => {
                                    const orderStatus = { status: "PAID" };
                                    const paymentStatus = { status: "AUTHORIZED" };
                                    order.orderStatus = orderStatus;
                                    order.paymentStatus = paymentStatus;
                                    order.orderStatusHistory.push(orderStatus);
                                    order.paymentHistory.push(paymentStatus);
                                    order.lastModified = Date.now();
                                    order.markModified('orderStatus');
                                    order.markModified('paymentStatus');
                                    order.markModified('orderStatusHistory');
                                    order.markModified('paymentHistory');
                                    order.markModified('lastModified');
                                    order.save();
                                    callback();
                                })
                                .catch((error) => {
                                    //console.log(error);
                                    callback(error);
                                });
                            }

                            if (paymentIntent.status !== 'succeeded' && attemptNum === "7") {
                                // change status to overdue
                                Order.findOne({ orderNumber: order.orderNumber })
                                .then(order => {
                                    const orderStatus = { status: "OVERDUE" };
                                    order.orderStatus = orderStatus;
                                    order.orderStatusHistory.push(orderStatus);
                                    order.lastModified = Date.now();
                                    order.markModified('orderStatus');
                                    order.markModified('orderStatusHistory');
                                    order.markModified('lastModified');
                                    order.save();
                                    callback();
                                })
                                .catch((error) => {
                                    //console.log(error);
                                    callback(error);
                                });
                            }
                           
                        }, (error) => {
                            if (error) {
                                console.log(error);
                                logger.error(`error(s) in recurring batch process | attempt Num: ${attemptNum} | ${orders.length - 1} orders have processed`);
                                // send message to Slack
                                return ch.ack(msg);
                            } else {
                                logger.info(`recurring batch have processed | attempt Num: ${attemptNum} | ${orders.length - 1} orders have processed`);
                                // send message to Slack
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

