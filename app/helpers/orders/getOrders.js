const Order = require('../../models/Order');
const logger = require('../../utils/logger');

function getOrders (req, res, next) {
    //console.log(req.query);
    const quries = req.query;
    Order.find(quries)
    .populate('user', 'email userId firstName lastName')
    .then((orders) => {
        //console.log(orders);
        logger.info(`getOrders request returned orders`);
        return res.status(200).json({
            status: 'success',
            orders: orders
        });
    }).catch(next);
    
}

module.exports = getOrders