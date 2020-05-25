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
    const channel = req.body.channel;
    const name = req.body.name;
    const description = req.body.description;
    const category = req.body.category;
    const categoryCode = req.body.categoryCode;
    const brand = req.body.brand;
    const brandCode = req.body.brandCode;
    const skinType = req.body.skinType;

    if (!channel||!name||!description||!category||!categoryCode||!brand||!brandCode||!skinType) {
        logger.warn(`createProduct request has rejected as param is missing`);
        return res.status(400).json({ 
            status: 'failed',
            message: 'bad request' 
        });
    }

    try {
        const payload = req.body;
        const product = await productDB.addProduct(payload);
        logger.info(`createProduct request has created new product | name: ${product.name} productId: ${product.productId}`);
        return res.status(201).json({
            status: 'success',
            product: product,
            message: 'new product created'
        });
    } catch (exception) {
        if (exception.status === "fail") {
            logger.error(`createProduct request has failed | error: ${exception.error.message}`);
            return res.status(422).json({
                status: "fail",
                message: exception.error.message
            });
        } else {
            next(exception);
        }
    }
};

product.updateProduct = async (req, res, next) => {
    return res.status(200).end();
};

product.deleteProductById = async (req, res, next) => {
    return res.status(200).end();
};

module.exports = product;