const productDB = require('../../../../../../infra/data-access/product-db');
const logger = require('../../../../../_shared/logger');

let product = {};

product.listProducts = async (req, res, next) => {
    return res.status(200).end();
};

product.getProductById = async (req, res, next) => {
    return res.status(200).end();
};

product.createProduct = async (req, res, next) => {
    // return 400 if required field are missing
    //fetch category
    //fetch brand
    //fetch skinType
    // try to create new product and return 201 with product object if success
    // return 422 if exception
    return res.status(200).end();
};

product.updateProduct = async (req, res, next) => {
    return res.status(200).end();
};

product.deleteProductById = async (req, res, next) => {
    return res.status(200).end();
};

module.exports = product;