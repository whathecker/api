const Order = require('../../models/Order');
const logger = require('../../utils/logger');

function updateShippingStatus (req, res, next) {
    console.log(req.body.update);
    if (!req.body.update) {
        logger.warn(`updateShippingStatus request has rejected as param is missing`);
        return res.status(400).json({ 
            status: 'failed',
            message: 'bad request' 
        });
    }

    Order.findOne({ orderNumber: req.params.id })
    .then(order => {
        if (!order) {
            logger.warn(`updateShippingStatus request is failed | unknown order number`);
            return res.status(422).json({
                status: 'failed',
                message: 'unknown order number'
            });
        }
        if (order) {
            console.log(order);

            if (order.shippedAmountPerItem.length > 0) {
                order.courier = req.body.update.courier;
                order.trackingNumber = req.body.update.trackingNumber;
                order.isShipped = true;
                order.lastModified = Date.now();
                order.orderStatus = {
                    status: 'SHIPPED',
                    timestamp: Date.now()
                };
                const orderStatusInstance = order.orderStatus;
                order.orderStatusHistory.push(orderStatusInstance);
                order.markModified('orderStatusHistory');
                order.markModified('orderStatus');
                order.markModified('isShipped');
                order.markModified('lastModified');
                order.markModified('courier');
                order.markModified('trackingNumber');
                order.save().then(() => {
                    return res.status(200).json({
                        status: 'success',
                        message: 'order is marked as shipped'
                    });
                });

            } else {
                logger.warn(`updateShippingStatus request is failed | no items packed yet`);
                return res.status(422).json({
                    status: 'failed',
                    message: "no items are packed for this order, finish packing first"
                }); 
            } 

        }

    }).catch(next);

}

module.exports = updateShippingStatus;