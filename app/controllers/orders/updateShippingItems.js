const Order = require('../../models/Order');
const logger = require('../../utils/logger');
const open = require('amqplib');
const rabbitMQConnection = require('../../utils/messageQueue/rabbitMQConnector');
const inventoryQueue = 'inventory';
const inventoryRetryQueue = 'inventory-retry';
const inventoryEx = 'inventory';
const inventoryRetryEx = 'inventory-retry';


function updateShippingDetail (req, res, next) {
    console.log(req.params.ordernumber);
    console.log(req.body.update);
    if (!req.body.update) {
        logger.warn(`updateShippingDetail request has rejected as param is missing`);
        return res.status(400).json({ 
            status: 'failed',
            message: 'bad request' 
        });
    }

    Order.findOne({ orderNumber: req.params.ordernumber })
    .then(order => {
        if (!order) {
            logger.warn(`updateShippingDetail request is failed | unknown order number`);
            return res.status(422).json({
                status: 'failed',
                message: 'unknown order number'
            });
        }

        if (order) {
            //console.log(order);
            if (order.isShipped) {
                logger.warn(`updateShippingDetail request is failed | order is shipped`);
                return res.status(422).json({
                    status: 'failed',
                    message: 'cannot update packed item of shipped order'
                });
            }

            if (order.shippedAmountPerItem.length > 0) {
                logger.warn(`updateShippingDetail request is failed | order are packed already`);
                return res.status(422).json({
                    status: 'failed',
                    message: "cannot update already packed order, remove all items in the list first"
                });
            }
            
            
            const itemsToUpdate = req.body.update.items;
            if (itemsToUpdate && itemsToUpdate.length !== 0) {
                const mappedArray = itemsToUpdate.map(item => {
                    const itemAmount = {
                        itemId: item.id,
                        name: item.name,
                        quantity: item.qtyToShip,
                        currency: item.prices[0].currency,
                        originalPrice: item.prices[0].price,
                        discount: "0",
                        vat: item.prices[0].vat,
                        netPrice: item.prices[0].netPrice,
                        grossPrice: item.prices[0].price,
                        sumOfDiscount: order.setSumOfItemPrice(0, item.qtyToShip),
                        sumOfVat: order.setSumOfItemPrice(item.prices[0].vat, item.qtyToShip),
                        sumOfGrossPrice: order.setSumOfItemPrice(item.prices[0].price, item.qtyToShip),
                        sumOfNetPrice: order.setSumOfItemPrice(item.prices[0].netPrice, item.qtyToShip)
                    }
                    console.log(itemAmount);
                    return item = itemAmount;

                });
                const totalAmount = order.setTotalAmount(mappedArray, mappedArray[0].currency);
                order.shippedAmountPerItem = mappedArray;
                order.shippedAmount = totalAmount;
                order.lastModified = Date.now();
                order.markModified('lastModified');
                order.markModified('shippedAmountPerItem');
                order.markModified('shippedAmount');

                // dispatch message to deduct inventory
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
                                action: 'deduct',
                                items: mappedArray
                            }
                            ch.publish(inventoryEx, '', Buffer.from(JSON.stringify(message)), { persistent: true });
                            ch.close().then(() => {
                                connection.close();
                            });
                        });
                    });

                }).catch(next);

            }

            order.save().then(() => {
                return res.status(200).json({
                    status: 'success',
                    message: 'shipping detail of order is updated'
                });
            });

            
        }
    });
}

module.exports = updateShippingDetail;