const Product = require('../../../db/mongodb/models/product');
const serializer = require('./serializer');
const createProductObj = require('../../../../domain/product');

const listProducts = async () => {
    const products = await Product.find();
    return Promise.resolve(serializer(products));
};

const findProductByProductId = async (productId) => {
    const product = await Product.findOne({ productId: productId });

    if (!product) {
        return Promise.resolve({
            status: "fail",
            reason: "product not found"
        });
    }

    return Promise.resolve(serializer(product));
};

const addProduct = async (payload) => {

    const productObj = createProductObj(payload);

    if (productObj instanceof Error) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: productObj
        });
    }

    try {
        await _isProductIdUnique(productObj.productId);
    }
    catch (err) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: err
        });
    }
    

    const newProduct = await Product.create(productObj);

    return Promise.resolve(serializer(newProduct));
};

async function _isProductIdUnique (productId) {
    const product = await findProductByProductId(productId);

    const { status } = product;

    if (status === "fail") return;

    throw new Error('db access for product object failed: productId must be unique');
}

const updateProduct = () => {
    // find product by product ID
    // replace field to be updated
    // create product object with updated payload
    // insert the updated product object in the db
};

const deleteProductByProductId = async (productId) => {
    const removedProduct = await Product.findOneAndRemove({
        productId: productId
    });

    if (!removedProduct) {
        return Promise.resolve({
            status: "fail",
            reason: "product not found"
        });
    }

    if (removedProduct) {
        return Promise.resolve({
            productId: removedProduct.productId,
            status: "success"
        });
    }

};

const dropAll = async () => {
    return Product.remove();
};

module.exports = {
    listProducts,
    findProductByProductId,
    addProduct,
    updateProduct,
    deleteProductByProductId,
    dropAll
};