const dbChoice = require('../_shared/dbAccessModuleSelector')();
let {
    listCarts,
    findCartById,
    addCart,
    updateCartLineItems,
    updateCartState,
    updateCartOwnership,
    deleteCartById,
    dropAll
} = require(`./${dbChoice}`);

module.exports = {
    listCarts,
    findCartById,
    addCart,
    updateCartLineItems,
    updateCartState,
    updateCartOwnership,
    deleteCartById,
    dropAll
};