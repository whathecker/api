const dbChoice = require('../_shared/dbAccessModuleSelector')();
let {
    listCarts,
    findCartById,
    addCart,
    updateCartLineItems,
    updateCartState,
    deleteCartById,
    dropAll
} = require(`./${dbChoice}`);

module.exports = {
    listCarts,
    findCartById,
    addCart,
    updateCartLineItems,
    updateCartState,
    deleteCartById,
    dropAll
};