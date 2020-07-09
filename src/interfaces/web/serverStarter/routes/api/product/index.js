const productDB = require('../../../../../../infra/data-access/product-db');
const logger = require('../../../../../_shared/logger');

let product = {};

product.listProducts = async (req, res, next) => {
    try {
        const products = await productDB.listProducts();
        logger.info(`list products endpoint has processed and returned products`);
        return res.status(200).json({
            status: "success",
            products: products
        });
    } catch (exception) {
        next(exception);
    }
};

product.getProductById = async (req, res, next) => {
    const productId = req.params.id;
    try {
        const product = await productDB.findProductByProductId(productId);
        
        if (product.status === "fail") {
            logger.warn(`getProductById request is failed | unknown productId`);
            return res.status(422).json({
                status: "fail",
                message: product.reason
            });
        }

        logger.info(`getProductById request is processed | ${product.productId}`);
        return res.status(200).json(product);
    } catch (exception) {
        next(exception);
    }
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
    const prices = req.body.prices;
    const inventory = req.body.inventory;
    const inventoryHistory = req.body.inventoryHistory;

    if (!channel||!name||!description||!category||!categoryCode||!brand||!brandCode||!skinType||!prices||!inventory||!inventoryHistory) {
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
    const channel = req.body.channel;
    const name = req.body.name;
    const description = req.body.description;
    const category = req.body.category;
    const categoryCode = req.body.categoryCode;
    const brand = req.body.brand;
    const brandCode = req.body.brandCode;
    const skinType = req.body.skinType;
    const prices = req.body.prices;
    const inventory = req.body.inventory;
    const inventoryHistory = req.body.inventoryHistory;

    if (!channel||!name||!description||!category||!categoryCode||!brand||!brandCode||!skinType||!prices||!inventory||!inventoryHistory) {
        logger.warn(`updateProduct request has rejected as param is missing`);
        return res.status(400).json({ 
            status: 'failed',
            message: 'bad request' 
        });
    }

    try {
        const productId = req.params.id;
        const payload = req.body;

        const updatedProduct = await productDB.updateProduct(productId, payload);
        const { status, reason } = updatedProduct;

        if (status === "fail") {
            logger.warn(`updateProduct request has rejected: ${reason} | requested productId: ${productId}`);
            return res.status(422).json({
                status: "failed",
                message: reason
            });
        }

        logger.info(`updateProduct request has updated the product | name: ${updatedProduct.name} productId: ${updatedProduct.productId}`);
        return res.status(200).json({
            status: 'success',
            message: 'product data has updated'
        });
        
    } catch (exception) {
        if (exception.status === "fail") {
            logger.error(`updateProduct request has failed | error: ${exception.error.message}`);
            return res.status(422).json({
                status: "fail",
                message: exception.error.message
            });
        } else {
            next(exception);
        }
    }
};

product.deleteProductById = async (req, res, next) => {
    const productId = req.params.id;
    try {
        const product = await productDB.deleteProductByProductId(productId);

        if (product.status === "fail") {
            logger.warn('deleteProduct request has rejected as product is unknown');
            return res.status(422).json({
                status: "fail",
                message: product.reason
            });
        }

        logger.info(`deleteProduct request has processed: following product has removed: ${product.productId}`);
        return res.status(200).json({
            status: "success",
            message: "product has removed"
        });
    } catch (exception) {
        next(exception);
    }
};

module.exports = product;