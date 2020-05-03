const dbChoice = require('../_shared/dbAccessModuleSelector')();
let {
    listOrders,
    findOrderByOrderNumber,
    addOrder,
    deleteOrderByOrderNumber,
    dropAll
} = require(`./${dbChoice}`);

module.exports = {
    listOrders,
    findOrderByOrderNumber,
    addOrder,
    deleteOrderByOrderNumber,
    dropAll
};