const orderDB = require('../../../../../../../infra/data-access/order-db');
const logger = require('../../../../../../_shared/logger');

let order = {};

order.listOrders = async (req, res, next) => {
    try {
        const orders = await orderDB.listOrders();
        logger.info(`listOrders endpoint has processed and returned orders`);
        return res.status(200).json({
            status: "success",
            orders: orders
        });
    } catch (exception) {
        next(exception);
    }
};

order.getOrderByOrdernumber = async (req, res, next) => {
    const orderNumber = req.params.ordernumber;

    try {
        const order = await orderDB.findOrderByOrderNumber(orderNumber);
        logger.info(`getOrderByorderNumber request is processed | ${order.orderNumber}`);
        return res.status(200).json(order);
    } catch (exception) {
        if (exception.status === "fail") {
            logger.warn(`getOrderByOrderNumber request is failed | unknown orderNumber`);
            return res.status(422).json({
                status: "fail",
                message: order.reason
            });
        }
        next(exception);
    }
};

order.updateShippingItems = async (req, res, next) => {
    return res.status(200).end();
};

order.updateShippingStatus = async (req, res, next) => {
    return res.status(200).end();
};

order.removePackedItems = async (req, res, next) => {
    return res.status(200).end();
};

module.exports = order;