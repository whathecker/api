const router = require('express').Router();

router.use('/', require('./user/user'));
router.use('/auth', require('./key/key'));
router.use('/', require('./product/product'));

module.exports = router;