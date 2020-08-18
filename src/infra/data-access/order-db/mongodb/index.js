const Order = require('../../../db/mongodb/models/order');
const createOrderObj = require('../../../../domain/order');
const serializer = require('./serializer');

const listOrders = async () => {
    const orders = await Order.find();
    return Promise.resolve(serializer(orders));
};

const listOrdersByUserId = async (userId) => {
    const orders = await Order.find({ user_id: userId });
    return Promise.resolve(serializer(orders));
};

const findOrderByOrderNumber = async (orderNumber) => {
    const order = await Order.findOne({ orderNumber: orderNumber });

    if (!order) {
        return Promise.reject({
            status: "fail",
            reason: "order not found"
        });
    }

    return Promise.resolve(serializer(order));
};

const addOrder = async (payload) => {

    const orderObj = createOrderObj(payload);

    if (orderObj instanceof Error) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: orderObj
        });
    }

    try {
        await _isOrderNumberUnique(orderObj.orderNumber);
    }
    catch (err) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: err
        });
    }

    const newOrder = await Order.create(orderObj);

    return Promise.resolve(serializer(newOrder));
};

async function _isOrderNumberUnique (orderNumber) {
    try {
        await findOrderByOrderNumber(orderNumber);
    } catch (err) {
        return;
    }

    throw new Error('db access for order object failed: orderNumber must be unique');
}

const deleteOrderByOrderNumber = async (orderNumber) => {
    const removedOrder = await Order.findOneAndRemove({
        orderNumber: orderNumber
    });

    if (!removedOrder) {
        return Promise.reject({
            status: "fail",
            reason: "order not found"
        });
    }

    if (removedOrder) {
        return Promise.resolve({
            orderNumber: removedOrder.orderNumber,
            status: "success"
        });
    }
};

const dropAll = async () => {
    return Order.remove();
};

module.exports = {
    listOrders,
    listOrdersByUserId,
    findOrderByOrderNumber,
    addOrder,
    deleteOrderByOrderNumber,
    dropAll
}