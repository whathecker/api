const orderQueue = 'order';
const orderRetryQueue = 'order-retry';
const open = require('amqplib');
const rabbitMQConnection = require('../messageQueue/rabbitMQConnector');
const logger = require('../logger');
const Order = require('../../models/Order');
const Subscription = require('../../models/Subscription');
const SubscriptionBox = require('../../models/SubscriptionBox');
const async = require('async');



function startMQConnection () {
    open.connect(rabbitMQConnection())
    .then(connection => {
        return connection.createChannel();
    })
    .then(ch => {
        const orderWorkQueue = ch.assertQueue(orderQueue, {
            deadLetterExchange: orderRetryQueue
        });

        const orderRetryWorkQueue = ch.assertQueue(orderRetryQueue, {
            deadLetterExchange: orderQueue,
            messageTtl: 300000
        });

        Promise.all([
            orderWorkQueue,
            orderRetryWorkQueue
        ]).then(() => {
            return ch.consume(orderQueue, (msg)=> {
                if (msg !== null) {
                    const message = JSON.parse(msg.content);
                    console.log(message);

                    const actionType = message.actionType;

                    Subscription.findOne({
                        subscriptionId: message.subscriptionId
                    })
                    .populate({
                        path: 'user',
                        populate: { path: 'defaultShippingAddress defaultBillingAddress' }
                    })
                    .populate('paymentMethod')
                    .then(subscription => {
                        const country = subscription.user.defaultShippingAddress.country.toLowerCase();
                        if (!subscription.isActive) {
                            // ack message 
                            logger.warn(`createOrder action for subscription num ${subscription.subscriptionId} is failed | subscription is not active`);
                            return ch.ack(msg);
                        }

                        if (subscription.isActive) {

                            switch(actionType) {
                                case 'createOrder':
                                    const currentEnv = process.env.NODE_ENV;
                                    let order = new Order();
                                    order.orderNumber = order.createOrderNumber(currentEnv, country);
                                    order.invoiceNumber = order.createInvoiceNumber();
                                    order.user = subscription.user._id;
                                    order.isSubscription = true;
                                    order.billingAddress = {
                                        firstName: subscription.user.defaultBillingAddress.firstName,
                                        lastName: subscription.user.defaultBillingAddress.lastName,
                                        mobileNumber: subscription.user.defaultBillingAddress.mobileNumber,
                                        postalCode: subscription.user.defaultBillingAddress.postalCode,
                                        houseNumber: subscription.user.defaultBillingAddress.houseNumber,
                                        houseNumberAdd: subscription.user.defaultBillingAddress.houseNumberAdd,
                                        streetName: subscription.user.defaultBillingAddress.streetName,
                                        country: subscription.user.defaultBillingAddress.country
                                    };
                                    order.shippingAddress = {
                                        firstName: subscription.user.defaultShippingAddress.firstName,
                                        lastName: subscription.user.defaultShippingAddress.lastName,
                                        mobileNumber: subscription.user.defaultShippingAddress.mobileNumber,
                                        postalCode: subscription.user.defaultShippingAddress.postalCode,
                                        houseNumber: subscription.user.defaultShippingAddress.houseNumber,
                                        houseNumberAdd: subscription.user.defaultShippingAddress.houseNumberAdd,
                                        streetName: subscription.user.defaultShippingAddress.streetName,
                                        country: subscription.user.defaultShippingAddress.country
                                    };
                                    order.orderStatus = { status: 'RECEIVED' };
                                    order.orderStatusHistory = [order.orderStatus];
                                    order.paymentStatus = { status: 'OPEN' };
                                    order.paymentHistory = [order.paymentStatus];
                                    order.paymentMethod = {
                                        type: subscription.paymentMethod.type,
                                        recurringDetail: subscription.paymentMethod.recurringDetail
                                    };

                                    let deliverySchedules = Array.from(subscription.deliverySchedules);
                                    const lastIndexSchedule = deliverySchedules[deliverySchedules.length - 1];
                                    //console.log(deliverySchedules);
                                    //console.log(lastIndexSchedule);
                                    if (lastIndexSchedule.isProcessed) {
                                        // set new schedule and create order
                                        const newDeliverySchedule = subscription.setDeliverySchedule(lastIndexSchedule.nextDeliveryDate, subscription.deliveryFrequency, subscription.deliveryDay, order.orderNumber);
                                        subscription.deliverySchedules.push(newDeliverySchedule);
                                        subscription.nextDeliverySchedule = newDeliverySchedule;
                                        subscription.markModified('deliverySchedules');
                                        subscription.markModified('nextDeliverySchedule');
                                    }
                                    if (lastIndexSchedule.isProcessed === false) {
                                        // create order and assign orderNumber to lastIndexSchedule
                                        deliverySchedules[deliverySchedules.length - 1].orderNumber = order.orderNumber;
                                        //console.log(deliverySchedules);
                                        subscription.deliverySchedules = deliverySchedules;
                                        //subscription.nextDeliverySchedule = newDeliverySchedule;
                                        subscription.markModified('deliverySchedules');
                                    }

                                    let orderAmountPerItem = [];
                                    const items = subscription.subscribedItems;
                                    async.each(items, (item, callback)=> {
                                        SubscriptionBox.findOne({id: item.itemId})
                                        .then(subscriptionBox => {
                                        
                                            const itemAmount = {
                                                itemId: subscriptionBox.id,
                                                name: subscriptionBox.name,
                                                quantity: item.quantity,
                                                currency: subscriptionBox.prices[0].currency,
                                                originalPrice: subscriptionBox.prices[0].price,
                                                discount: "0",
                                                vat: subscriptionBox.prices[0].vat, /** to update later when discount is added */
                                                grossPrice: subscriptionBox.prices[0].price,
                                                netPrice: subscriptionBox.prices[0].netPrice,
                                                sumOfDiscount: order.setSumOfItemPrice("0", item.quantity),
                                                sumOfVat: order.setSumOfItemPrice(subscriptionBox.prices[0].vat, item.quantity),
                                                sumOfGrossPrice: order.setSumOfItemPrice(subscriptionBox.prices[0].price, item.quantity),
                                                sumOfNetPrice: order.setSumOfItemPrice(subscriptionBox.prices[0].netPrice, item.quantity)
                                            }
                                            orderAmountPerItem.push(itemAmount);
                                            callback();
                                        });
                                    }, (err) => {
                                        if (err) {
                                            // fire message to Slack
                                            logger.error(`createOrder action for subscription num ${subscription.subscriptionId} is failed | unexpected error in async loop`);
                                            return ch.nack(msg, false, false);
                                        }
                                        
                                        order.orderAmountPerItem = orderAmountPerItem;
                                        order.orderAmount=  order.setTotalAmount(order.orderAmountPerItem, 'euro');
                                        subscription.orders.push(order);
                                        Promise.all([
                                            order.save(),
                                            subscription.save()
                                        ]).then(values => {
                                            if (values) {
                                                console.log(values);
                                                logger.info(`createOrder action for subscription num ${subscription.subscriptionId} is processed | new order ${order.orderNumber}`);
                                                return ch.ack(msg);
                                            }
                                            
                                        }).catch(error => {
                                            if (error) {
                                                // fire message to Slack
                                                console.log(error);
                                                logger.error(`createOrder action for subscription num ${subscription.subscriptionId} is failed | failed to save updates in db`);
                                                return ch.nack(msg, false, false);
                                            } 
                                        });

                                    });
                                    
                                    break;
                            }
                        }

                    }).catch(console.warn);

                    
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