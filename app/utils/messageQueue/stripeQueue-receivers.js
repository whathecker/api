const queue = 'stripe';
const retryQueue = 'stripe-retry';
const open = require('amqplib');
const rabbitMQConnection = require('./rabbitMQConnector');
const logger = require('../logger');
const stripeHelpers = require('../stripe/stripeHelpers');
const stripe = require('stripe')(stripeHelpers.retrieveApikey(process.env.NODE_ENV));
const Order = require('../../models/Order');

function processCheckoutSessionComplete (session_id) {
    return new Promise((resolve, reject) => {
        stripe.checkout.sessions.retrieve(session_id, (err, session) => {

            if (err) {
                return reject({
                    status: "failed",
                    message: 'invalid session id'
                });
            }

            if (session) {
                const orderNumber = session.client_reference_id;

                Order.findOne({ orderNumber: orderNumber })
                .then(order => {
                    if (!order) {
                        logger.warn(`${eventType} hook has failed to process | can't find the order`);
                        return reject({
                            status: "failed",
                            message: 'invalid order number'
                        });
                    }

                    if (order && order.orderStatus.status === "AUTHORIZED" && order.paymentStatus.status === 'PAID') {
                        logger.info(`${eventType} hook has already authorized | ${order.orderNumber} | order status: ${order.orderStatus.status} | payment status: ${order.paymentStatus.status}`);
                        return reject({
                            status: 'failed',
                            message: 'order has already paid'
                        });
                    }

                    if (order && order.orderStatus.status !== 'AUTHORIZED' && order.paymentStatus.status !== 'PAID') {
                        console.log(order);
                        const paymentStatus = { status: 'AUTHORIZED', timestamp: Date.now() };
                        order.paymentStatus = paymentStatus;
                        order.paymentHistory.push(order.paymentStatus);
                        order.markModified('paymentStatus');
                        order.markModified('paymentHistory');
                        const orderStatus = { status: 'PAID', timestamp: Date.now() };
                        order.orderStatus = orderStatus;
                        order.orderStatusHistory.push(order.orderStatus);
                        order.markModified('orderStatus');
                        order.markModified('orderStatusHistory');
                        order.save();
                        logger.info(`${eventType} hook has processed | ${order.orderNumber} | order status: ${order.orderStatus.status} | payment status: ${order.paymentStatus.status}`);
                        return resolve({
                            status: 'success'
                        });
                    }
                }).catch(err => {
                    return reject({
                        status: 'failed',
                        message: 'error in retrieving order model from DB'
                    });
                });
            }
        });
    });
}

function processRefund () {
    //TODO: move logics to this fuction
}

function startMQConnection () {
    open.connect(rabbitMQConnection())
    .then(connection => {
        return connection.createChannel()
    })
    .then(ch => {
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
        ])
        .then(ok => {
            return ch.consume(queue, (msg) => {
                if (msg !== null) {
                    const message = JSON.parse(msg.content);
                    const eventType = message.type;
                    console.log(message);
                    console.log(eventType);

                    if (eventType === 'charge.refunded' && message.data.object.status === 'succeeded') {
                        stripe.paymentIntents.retrieve(message.data.object.payment_intent)
                        .then(paymentIntent => {
    
                            const orderNumber = paymentIntent.metadata.orderNumber;
                            
                            Order.findOne({ orderNumber: orderNumber })
                            .then(order => {
                                if (!order) {
                                    logger.warn(`${eventType} hook has failed to process | can't find the order | send to retry queue`);
                                    return ch.nack(msg, false, false);
                                }
                                if (!order && msg.properties.headers['x-death']) {
                                    const retryCount = msg.properties.headers['x-death'][0].count;
                                    if (retryCount <= 5) {
                                        logger.warn(`${eventType} hook has failed to process | can't find the order | send to retry queue | retry count: ${retryCount}`);
                                        return ch.nack(msg, false, false);
                                    } else {
                                        // send message to Slack
                                        logger.warn(`${eventType} hook has failed to process | can't find the order | retry count exceed 5 times`);
                                        return ch.ack(msg);
                                    }
                                }
                                if (order) {
                                    const refundStatus = { status: 'REFUNDED', timestamp: Date.now() };
                                    order.paymentStatus = refundStatus;
                                    order.paymentHistory.push(order.paymentStatus);
                                    order.markModified('paymentStatus');
                                    order.markModified('paymentHistory');
                                    if (order.orderStatus.status !== 'SHIPPED') {
                                        const canceledStatus = { status: 'CANCELLED', timestamp: Date.now() };
                                        order.orderStatus = canceledStatus;
                                        order.orderStatusHistory.push(order.orderStatus);
                                        order.markModified('orderStatus');
                                        order.markModified('orderStatusHistory');
                                    }
                                    order.save();
                                    logger.info(`${eventType} hook has processed | ${order.orderNumber} | order status: ${order.orderStatus.status} | payment status: ${order.paymentStatus.status}`);
                                    return ch.ack(msg);
                                }
                            }).catch(console.warn);

                        }).catch(error => {
                            // failed to find paymentIntent
                            console.warn;
                        });
                        
                    }

                    if (eventType === "checkout.session.completed") {

                        (async () => {

                            try {
                                const result = await processCheckoutSessionComplete(message.data.object.id);

                                if (result.status === "success") {
                                    return ch.ack(msg);
                                }
    
                            }
                            catch(err) {

                                if (err.status === "failed" && msg.properties.headers['x-death']) {
                                    const retryCount = msg.properties.headers['x-death'][0].count;
    
                                    if (retryCount <= 5) {
                                        logger.warn(`${eventType} hook has failed to process | ${err.message} | send to retry queue | retry count: ${retryCount}`);
                                        return ch.nack(msg, false, false);
                                    } 
                                    if (retryCount > 5) {
                                        // send message to Slack
                                        logger.warn(`${eventType} hook has failed to process | ${err.message} | retry count exceed 5 times, debug the message`);
                                        return ch.ack(msg);
                                    }
                                }

                                if (err.status === "failed" && !msg.properties.headers['x-death']) {
                                    logger.warn(`${eventType} hook has failed to process | ${err.message} | send to retry queue | retry count: 0`);
                                    return ch.nack(msg, false, false);
                                }

                            }
                            
                        })();

                    }
                    

                }
            })
        }).catch(console.warn);

    }).catch(error => {
        console.log('retry to connect rabbitmq because rabbitmq might not started yet' + 'stripeQueue');
        if (error) {
            return setTimeout(startMQConnection, 15000);
        }
    });
}

startMQConnection();