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

    const new_id = PRODUCTS.length + 1;

    const newProduct = {
        _id: new_id.toString(),
        ...productObj
    };
    PRODUCTS.push(newProduct);

    return Promise.resolve(PRODUCTS[PRODUCTS.length - 1]);
};

async function _isProductIdUnique (productId) {
    try {
        await findProductByProductId(productId);
    } catch (err) {
        return;
    }

    throw new Error('db access for product object failed: productId must be unique');
}

const updateProduct = async (id, payload) => {
    const product = await findProductByProductId(id);
    const { status, _id, productId, ...rest} = product;

    if (status === "fail") {
        return Promise.reject({
            status: "fail",
            reason: "product not found"
        });
    }
   
    let updatedPayload;

    try  {
        updatedPayload = _buildUpdatedPayload(payload, product);
    } catch (err) {
        return Promise.reject({
            status: "fail",
            reason: "cannot update immutable fields",
            error: err
        });
    }

    const productObj = createProductObj(updatedPayload);

    if (productObj instanceof Error) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: productObj
        });
    }

    const updatedProduct = {
        _id: _id,
        ...productObj
    };
    const index_in_db_array = parseInt(_id) - 1;
    PRODUCTS[index_in_db_array] = updatedProduct;

    return Promise.resolve(PRODUCTS[index_in_db_array]);
};

function _buildUpdatedPayload (payload, product) {

    const fieldsToCheckInPayload = {
        category: payload.category,
        categoryCode: payload.categoryCode,
        brand: payload.brand,
        brandCode: payload.brandCode
    };

    const fieldsToCheckInProduct = {
        category: product.category,
        categoryCode: product.categoryCode,
        brand: product.brand,
        brandCode: product.brandCode
    };
    
   const result_immutableFields_update = _isImmutableFieldsUpdated(fieldsToCheckInPayload, fieldsToCheckInProduct);
   const { status, updatedField } = result_immutableFields_update;

   if (status === true) {
       throw new Error(`db access for product object failed: ${updatedField} cannot be updated after product has created`);
   }

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

function _isImmutableFieldsUpdated (fields_in_payload, fields_in_product) {
    let result = {
        status: false,
        updatedField: null
    };

    for (let prop of Object.keys(fields_in_payload)) {
        if (fields_in_payload[prop] !== fields_in_product[prop]) {
            result.status = true;
            result.updatedField = prop;
            break;
        }
    }
    return result;
}

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