const inventoryQueue = 'inventory';
const inventoryRetryQueue = 'inventory-retry';
const open = require('amqplib');
const rabbitMQConnection = require('../messageQueue/rabbitMQConnector');
const logger = require('../logger');
const Product = require('../../models/Product');
const async = require('async');

function startMQConnection () {
    open.connect(rabbitMQConnection())
    .then(connection => {
        return connection.createChannel();
    })
    .then(ch => {
        const inventoryWorkQueue = ch.assertQueue(inventoryQueue, {
            deadLetterExchange: inventoryRetryQueue
        });

        const inventoryRetryWorkQueue = ch.assertQueue(inventoryRetryQueue, {
            deadLetterExchange: inventoryQueue,
            messageTtl: 300000
        });

        Promise.all([
            inventoryWorkQueue,
            inventoryRetryWorkQueue
        ]).then(() => {
            return ch.consume(inventoryQueue, (msg)=> {
                if (msg !== null) {
                    const message = JSON.parse(msg.content);
                    console.log(message);
                   
                    // deduct inventory and update related fields of each product
                    async.each(message, function (e, callback) {
                        Product.findOne({ id: e.itemId })
                        .then(product => {
                            if (!product) {
                                // trigget investigation
                                logger.warn(`attempted to update inventory but failed: product id is unknonw`);
                                callback();
                            }
                            if (product) {
                                const qtyToDeduct = e.quantity;
                                const currentQty = product.inventory.quantityOnHand;
                                product.inventory.quantityOnHand = currentQty - qtyToDeduct;
                                product.inventory.lastModified = Date.now();
                                const inventoryUpdate = product.inventory;
                                product.inventoryHistory.push(inventoryUpdate);
                                product.markModified('inventory');
                                product.markModified('inventoryHistory');
                                product.save();
                                logger.info(`inventory of ${e.itemId} has updated: prevQTY ${currentQty} to ${product.inventory.quantityOnHand}`);
                                callback();
                            }
                        }).catch(console.warn);

                    }, function (err) {
                        if (err) {
                            console.log(err);
                            logger.error(`inventory deduction has processed, but there was an error`);
                            return ch.ack(msg);
                        } else {
                            logger.info(`inventory deductions have processed`);
                            return ch.ack(msg);
                        }
                    });
                      
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