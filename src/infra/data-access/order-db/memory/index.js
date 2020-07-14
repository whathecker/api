let ORDERS = require('../../../db/memory/order');
const createOrderObj = require('../../../../domain/order');

const listOrders = () => {
    return Promise.resolve(ORDERS);
};

const findOrderByOrderNumber = (orderNumber) => {
    const order = ORDERS.find(order => {
        return order.orderNumber === orderNumber;
    });

    if (!order) {
        return Promise.reject({
            status: "fail",
            reason: "order not found"
        });
    }

    return Promise.resolve(order);
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

    const new_id = ORDERS.length + 1;

    const newOrder = {
        _id: new_id.toString(),
        ...orderObj
    };
    ORDERS.push(newOrder);

    return Promise.resolve(ORDERS[ORDERS.length - 1]);
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
    const order = await findOrderByOrderNumber(orderNumber);

    const { status } = order;

    if (status === "fail") {
        return Promise.reject({
            status: "fail",
            reason: "order not found"
        });
    }

    let deletedOrder;
    ORDERS = ORDERS.filter(order => {

        if (order.orderNumber !== orderNumber) {
            return true;
        }

        if (order.orderNumber === orderNumber) {
            deletedOrder = order;
            return false;
        }
    });

    return Promise.resolve({
        orderNumber: deletedOrder.orderNumber,
        status: "success"
    });
};

const dropAll = () => {
    ORDERS = [];
    return Promise.resolve(ORDERS);
};

module.exports = {
    listOrders,
    findOrderByOrderNumber,
    addOrder,
    deleteOrderByOrderNumber,
    dropAll
}

