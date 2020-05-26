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

const updateProduct = async (id, payload) => {
    const product = await findProductByProductId(id);
    const { status, _id, productId, ...rest} = product;

    if (status === "fail") {
        return Promise.resolve({
            status: "fail",
            reason: "product not found"
        });
    }

    let updatedPayload = _buildUpdatedPayload(payload, product);
    const productObj = createProductObj(updatedPayload);

    if (productObj instanceof Error) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: productObj
        });
    }

    const updatedProduct = await Product.findOneAndUpdate({
        productId: productId
    }, productObj, { new: true });

    return Promise.resolve(serializer(updatedProduct));
};

function _buildUpdatedPayload (payload, product) {
    let updatedPayload = payload;
    updatedPayload.productId = product.productId;
    updatedPayload.lastModified = new Date(Date.now());

    const result_inventory_update = _isInventoryUpdated(payload.inventory, product.inventory);

    if (result_inventory_update === true) {
        updatedPayload.inventory.lastModified = new Date(Date.now());
        const newInventoryHistory = updatedPayload.inventory;
        updatedPayload.inventoryHistory.push(newInventoryHistory);
    }
    return updatedPayload;
};

function _isInventoryUpdated (inventory_in_payload, inventory_in_product) {
     let result = false;

     for (let prop of Object.keys(inventory_in_payload)) {
         if (inventory_in_payload[prop] !== inventory_in_product[prop]) {
             result = true;
             break;
         }
     }
     return result;
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