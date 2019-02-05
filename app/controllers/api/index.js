const router = require('express').Router();

router.use('/', require('./user/user'));
router.use('/auth', require('./key/key'));
router.use('/product', require('./product/product'));
router.use('/inventory', require('./inventory/inventory'));

module.exports = router;