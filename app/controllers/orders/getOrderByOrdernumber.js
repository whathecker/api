const Order = require('../../models/Order');
const logger = require('../../utils/logger');

function getOrderByOrdernumber (req, res, next) {

    Order.findOne({ orderNumber: req.params.ordernumber })
    .populate({
        path: 'user',
        populate: { path: 'defaultShippingAddress defaultBillingAddress'},
        select: 'email userId firstName lastName defaultShippingAddress defaultBillingAddress',
    })
    .then(order => {
        if (!order) {
            logger.warn(`getOrderByOrdernumber request is failed | unknown order number`);
            return res.status(422).json({
                status: 'failed',
                message: 'unknown order number'
            });
        }
        if (order) {
            logger.info(`getOrderByOrdernumber request is processed | ${order.orderNumber}`);
            return res.status(200).json({
                status: 'success',
                order: order,
                message: 'order is returned'
            });
        }
        
    }).catch(next);
}

module.exports = getOrderByOrdernumber;