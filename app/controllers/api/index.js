const router = require('express').Router();

router.use('/checkout', require('./checkout/checkout'));
router.use('/auth', require('./key/key'));
router.use('/products', require('./product/product'));
router.use('/inventory', require('./inventory/inventory'));
router.use('/subscriptionBoxes', require('./subscriptionBox/subscriptionBox'));
router.use('/subscriptions', require('./subscription/subscription'));
router.use('/mail', require('./mail/mail'));
router.use('/crm', require('./crm/crm'));
router.use('/', require('./user/user'));

router.use('/admin/users', require('./admin/adminUser/adminUser'));

module.exports = router;