const router = require('express').Router();
const apiAuth =  require('../../../middlewares/verifyApikey');
const adminAuth = require('../../../middlewares/adminAuth');

const getProducts = require('../../../controllers/products/getProducts');
const getProductById = require('../../../controllers/products/getProductById');
const createProduct = require('../../../controllers/products/createProduct');
const updateProduct = require('../../../controllers/products/updateProduct');
const deleteProduct = require('../../../controllers/products/deleteProduct');

router.use(apiAuth);

router.get('/', adminAuth, getProducts);
router.get('/product/:id', adminAuth, getProductById);
router.put('/product/:id', adminAuth, updateProduct);
router.post('/product', adminAuth, createProduct);
router.delete('/product/:id', adminAuth, deleteProduct);

module.exports = router;


