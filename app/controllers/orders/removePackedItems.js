const Order = require('../../models/Order');
const logger = require('../../utils/logger');
const open = require('amqplib');
const rabbitMQConnection = require('../../utils/messageQueue/rabbitMQConnector');
const inventoryQueue = 'inventory';
const inventoryRetryQueue = 'inventory-retry';
const inventoryEx = 'inventory';
const inventoryRetryEx = 'inventory-retry';

function removePackedItems (req, res, next) {

    const orderNumber = req.params.ordernumber;
    const itemId = req.params.itemId;
    
    Order.findOne({ orderNumber: orderNumber })
    .then(order => {
        if (!order) {
            logger.warn(`removePackedItems request is failed | unknown order number`);
            return res.status(422).json({
                status: 'failed',
                message: 'unknown order number'
            });
        }
        if (order) {

            if (order.isShipped) {
                logger.warn(`removePackedItems request is failed | order is shipped`);
                return res.status(422).json({
                    status: 'failed',
                    message: 'cannot remove packed item of shipped order'
                });
            } else {
                // packed item can only be removed when order has not shipped

                let removedItem = [];

                const filteredShippedItems = Array.from(order.shippedAmountPerItem).filter(item => {
                    if (item.itemId === itemId) {
                        removedItem.push(item);
                        return false;
                    } else {
                        return true;
                    }
                });
                
                order.shippedAmountPerItem = filteredShippedItems;
                // When no items are left in packed list, set total shipped amount to 0
                if (filteredShippedItems.length === 0) {
                    order.shippedAmount = {
                        currency: '',
                        totalDiscount: "0",
                        totalVat: "0",
                        totalAmount: "0",
                        totalNetPrice: "0"
                    }
                }
                if (filteredShippedItems.length !== 0) {
                    order.shippedAmount = order.setTotalAmount(filteredShippedItems, filteredShippedItems[0].currency);
                }
                order.lastModified = Date.now();
                order.markModified('lastModified');
                order.markModified('shippedAmountPerItem');
                order.markModified('shippedAmount');
    
                // dispatch message to add inventory
                open.connect(rabbitMQConnection()).then(connection => {
                    connection.createChannel()
                    .then(ch => {
                        const exchange = ch.assertExchange(inventoryEx, 'direct', { durable: true});
                        const retryExchange = ch.assertExchange(inventoryRetryEx, 'direct', { durable: true });
                        const bindQueue = ch.bindQueue(inventoryQueue, inventoryEx);
                        const bindRetryQueue = ch.bindQueue(inventoryRetryQueue, inventoryRetryEx);
    
                        Promise.all([
                            exchange,
                            retryExchange,
                            bindQueue,
                            bindRetryQueue
                        ]).then(() => {
                            const message = {
                                action: 'add',
                                items: removedItem
                            }
                            ch.publish(inventoryEx, '', Buffer.from(JSON.stringify(message)), { persistent: true });
                            ch.close().then(() => {
                                connection.close();
                            });
                        })
    
                    })
    
                }).catch(next);
    
                order.save().then((order) => {
                    logger.warn(`removePackedItems request is processed | ${itemId} has removed from packed list`);
                    return res.status(200).json({
                        status: 'success',
                        message: 'removed'
                    });
                });
            }
            
        }
    }).catch(next);
    
}

module.exports = removePackedItems