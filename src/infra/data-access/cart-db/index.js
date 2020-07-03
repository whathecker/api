const dbChoice = require('../_shared/dbAccessModuleSelector')();
let {
    listCarts,
    findCartById,
    addCart,
    deleteCartById,
    dropAll
} = require(`./${dbChoice}`);

module.exports = {
    listCarts,
    findCartById,
    addCart,
    deleteCartById,
    dropAll
};