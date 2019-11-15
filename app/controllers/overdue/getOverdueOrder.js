const logger = require('../../utils/logger');
const jwt = require('jsonwebtoken');
const Order = require('../../models/Order');

async function getOverdueOrder (req, res, next) {

    //console.log(req.params.token);
    const token = req.params.token;

    if (!token) {
        logger.warn(`getOverdueOrder request is failed | no token provided`);
        return res.status(400).json({
            status: 'failed',
            message: "bad request"
        });
    }

    if (token) {
        const tokenSecret = process.env.OVERDUE_ORDER_TOKEN_SECRET;
        
        jwt.verify(token, tokenSecret, (err, decoded) => {
            if (err) {
                //console.log(err);
                logger.warn(`getOverdueOrder request is failed | invalid token`);
                return res.status(422).json({
                    message: "token is invalid"
                });
            } else {
                //console.log(decoded);
                Order.findOne({ orderNumber: decoded.orderNumber})
                .then(order => {
                    if (!order) {
                        logger.warn(`getOverdueOrder request is failed | invalid order`);
                        return res.status(422).json({
                            message: "invalid order"
                        });
                    }

                    if (order) {
                        logger.info(`getOverdueOrder request is processed | order number: ${order.orderNumber}`);
                        return res.status(200).json({
                            message: "success",
                            userId: decoded.userId,
                            email: decoded.email,
                            order: order
                        });
                    }
                }).catch(next);
            }
        });
    }
}

module.exports = getOverdueOrder;