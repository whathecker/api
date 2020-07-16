const dbChoice = require('../_shared/dbAccessModuleSelector')();
let {
    listCarts,
    findCartById,
    addCart,
    updateCartLineItems,
    updateCartState,
    updateCartOwnership,
    updateCartShippingInfo,
    updateCartPaymentInfo,
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
    updateCartShippingInfo,
    updateCartPaymentInfo,
    deleteCartById,
    dropAll
};