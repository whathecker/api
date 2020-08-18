const dbChoice = require('../_shared/dbAccessModuleSelector')();
let {
    listOrders,
    listOrdersByUserId,
    findOrderByOrderNumber,
    addOrder,
    deleteOrderByOrderNumber,
    dropAll
} = require(`./${dbChoice}`);

module.exports = {
    listOrders,
    listOrdersByUserId,
    findOrderByOrderNumber,
    addOrder,
    deleteOrderByOrderNumber,
    dropAll
};