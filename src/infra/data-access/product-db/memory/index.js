let PRODUCTS = require('../../../db/memory/product');
const createProductObj = require('../../../../domain/product');

const listProducts = () => {
    return Promise.resolve(PRODUCTS);
};

const findProductByProductId = (productId) => {
    const product = PRODUCTS.find(product => {
        return product.productId === productId;
    });

    if (!product) {
        return Promise.reject({
            status: "fail",
            reason: "product not found"
        });
    }

    return Promise.resolve(product);
};

const addProduct = (payload) => {

    const productObj = createProductObj(payload);

    if (productObj instanceof Error) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: productObj
        });
    }

    try {
        _isProductIdUnique(productObj.productId);
    }
    catch (err) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: err
        });
    }

    const new_id = PRODUCTS.length + 1;

    const newProduct = {
        _id: new_id.toString(),
        ...productObj
    };
    PRODUCTS.push(newProduct);

    return Promise.resolve(PRODUCTS[PRODUCTS.length - 1]);
};

async function _isProductIdUnique (productId) {
    const product = await findProductByProductId(productId);

    const { status } = product;

    if (status === "fail") return;

    throw new Error('db access for product object failed: productId must be unique');
}

const updateProduct = () => {

};

const deleteProductByProductId = async (productId) => {
    const product = await findProductByProductId(productId);

    const { status } = product;

    if (status === "fail") {
        return Promise.reject({
            status: "fail",
            reason: "product not found"
        });
    }

    let deletedProduct;
    PRODUCTS = PRODUCTS.filter(product => {

        if (product.productId !== productId) {
            return true;
        }

        if (product.productId === productId) {
            deletedProduct = product;
            return false;
        }
    });

    return Promise.resolve({
        productId: deletedProduct.productId,
        status: "success"
    });
};

const dropAll = () => {
    PRODUCTS = [];
    return Promise.resolve(PRODUCTS);
};

module.exports = {
    listProducts,
    findProductByProductId,
    addProduct,
    updateProduct,
    deleteProductByProductId,
    dropAll
};