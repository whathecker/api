const Product = require('../../models/Product');
const logger = require('../../utils/logger');

function updateProduct (req, res, next) {
    if (!req.params.id || !req.body.update) {
        logger.warn(`product update request has rejected as param is missing`);
        return res.status(400).json({ 
            status: "failed",
            message: 'bad request' 
        });
    }

    let update = req.body.update;
    update.lastModified = Date.now();

    Product.findOneAndUpdate({ id: req.params.id }, req.body.update)
    .then((product) => {
        if(!product) {
            logger.warn(`product update request has rejected as product id is unknown`);
            return res.status(204).json({ 
                status: 'failed',
                message: `can not find product` 
            });
        }
        logger.info(`product update has succeed: ${product}`);
        return res.status(200).json({
            status: "success",
            product: product,
            message: 'product data is updated'
        });
    }).catch(next);

}

module.exports = updateProduct;