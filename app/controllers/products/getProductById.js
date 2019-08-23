const Product = require('../../models/Product');
const logger = require('../../utils/logger');

function getProductById (req, res, next) {
    Product.findOne({ id: req.params.id })
    .then((product) => {
        if (!product) {
            logger.warn(`getProductById request is failed | unknown productId`)
            return res.status(422).json({ 
                status: 'failed',
                message: 'unknown product id'
            });
        }
        logger.info(`getProductById request is processed | ${product.id}`);
        return res.status(200).json({
            status: 'success',
            product: product,
            message: 'product is returned'
        });
    }).catch(next);

}

module.exports = getProductById;