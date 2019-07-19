const Product = require('../../models/Product');
const logger = require('../../utils/logger');

function getProducts (req, res, next) {
    Product.find()
    .then((products) => {
        logger.info(`getProducts endpoint has processed and returned products`);
        return res.status(200).json({
            status: 'success',
            products: products
        });
    }).catch(next);
    
}

module.exports = getProducts;