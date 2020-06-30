const orderDB = require('../../../../../../infra/data-access/order-db');
const logger = require('../../../../../_shared/logger');

let order = {};

order.listOrders = async (req, res, next) => {
    return res.status(200).end();
};

order.getOrderByOrdernumber = async (req, res, next) => {
    return res.status(200).end();
};

order.updateShippingStatus = async (req, res, next) => {
    return res.status(200).end();
};

order.updateShippingItems = async (req, res, next) => {
    return res.status(200).end();
};

order.removePackedItems = async (req, res, next) => {
    return res.status(200).end();
};

module.exports = order;