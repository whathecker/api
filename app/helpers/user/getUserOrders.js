const User = require('../../models/User');
const logger = require('../../utils/logger');

function getUserOrders (req, res, next) {

    if (req.user) {
        User.findById(req.user._id)
        .populate('orders')
        .then((user) => {
            if (user) {
                let orders = [];
                
                for (let i = 0; i < user.orders.length; i++) {
                    //console.log(user.orders[i]);
                    const order = {
                        orderNumber: user.orders[i].orderNumber,
                        isSubscription: user.orders[i].isSubscription,
                        orderStatus: user.orders[i].orderStatus,
                        paymentMethod: user.orders[i].paymentMethod,
                        paymentStatus: user.orders[i].paymentStatus,
                        isShipped: user.orders[i].isShipped,
                        shippedDate: user.orders[i].shippedDate,
                        shippingCarrier: user.orders[i].shippingCarrier,
                        trackingNumber: user.orders[i].trackingNumber,
                        creationDate: user.orders[i].creationDate,
                        orderAmount: user.orders[i].orderAmount
                    }
                    orders.push(order);
                }

                if (orders.length > 1) {
                    orders.sort((a, b) => {
                        const dateA = a.creationDate.getTime();
                        const dateB = b.creationDate.getTime();
                        return dateA - dateB;
                    });
                }

                const orderData = { orders: orders }

                logger.info(`getUserOrders request has returned data ${user.email}`);
                return res.status(200).json(orderData);
            } else {
                logger.info(`getUserOrders request has not returned data`);
                return res.status(204).json({ message: 'no user' });
            }
        }).catch(next);
    } 
}

module.exports = getUserOrders;
