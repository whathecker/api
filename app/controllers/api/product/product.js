const router = require('express').Router();
const Product = require('../../../models/Product');
const logger = require('../../../utils/logger');
const apiAuth =  require('../../../middlewares/verifyApikey');
const adminAuth = require('../../../middlewares/adminAuth');

const getProducts = require('../../../helpers/products/getProducts');
const getProductById = require('../../../helpers/products/getProductById');
const createProduct = require('../../../helpers/products/createProduct');
const updateProduct = require('../../../helpers/products/updateProduct');
const deleteProduct = require('../../../helpers/products/deleteProduct');

router.use(apiAuth);

router.get('/', adminAuth, getProducts);

router.get('/product/:id', adminAuth, getProductById);
router.put('/product/:id', adminAuth, updateProduct);
router.post('/product', adminAuth, createProduct);
router.delete('/product/:id', adminAuth, deleteProduct);
router.delete('/:id', (req, res, next) => {
    /*
    if (!req.params.id) {
        logger.warn('product delete request has rejected as id param is missing');
        return res.status(400).json({ message: 'bad request' });
    }*/

    Product.findOneAndRemove({ id: req.params.id })
    .then((product)=> {
        if (!product) {
            logger.warn('product delete request has rejected as product is unknown')
            return res.status(204).json({ message: 'can not find product' })
        }
        logger.info(`product delete request has succeed: ${product}`);
        return res.status(200).json(product);
    }).catch(next);
});

module.exports = router;


