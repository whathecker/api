const dbChoice = require('../_shared/dbAccessModuleSelector')();
let {
    listProducts,
    findProductByProductId,
    addProduct,
    updateProduct,
    deleteProductByProductId,
    dropAll
} = require(`./${dbChoice}`);

module.exports = {
    listProducts,
    findProductByProductId,
    addProduct,
    updateProduct,
    deleteProductByProductId,
    dropAll
};