const router = require('express').Router();
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

module.exports = router;


