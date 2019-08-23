const Product = require('../../models/Product');
const logger = require('../../utils/logger');

function deleteProduct (req, res, next) {

    if (!req.params.id) {
        logger.warn('deleteProduct request has rejected as id param is missing');
        return res.status(400).json({ 
            status: 'failed',
            message: 'bad request' 
        });
    }
    if (req.params.id) {
        Product.findOneAndRemove({ id: req.params.id })
        .then((product)=> {
            if (!product) {
                logger.warn('deleteProduct request has rejected as product is unknown')
                return res.status(422).json({ 
                    status: 'failed',
                    message: 'can not find product' 
                })
            }
            logger.info(`deleteProduct request has succeed: ${product.id}`);
            return res.status(200).json({
                status: 'success',
                message: 'product has removed'
            });
        }).catch(next);
    }
    
}

module.exports =  deleteProduct;