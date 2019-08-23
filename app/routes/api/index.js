const router = require('express').Router();

router.use('/checkout', require('./checkout/checkout'));
router.use('/auth', require('./key/key'));
router.use('/products', require('./product/product'));
router.use('/inventory', require('./inventory/inventory'));
router.use('/subscriptionBoxes', require('./subscriptionBox/subscriptionBox'));
router.use('/subscriptions', require('./subscription/subscription'));
router.use('/mail', require('./mail/mail'));
router.use('/crm', require('./crm/crm'));
router.use('/orders', require('./order/order'));
router.use('/admin/users', require('./admin/adminUser/adminUser'));
router.use('/admin/skintypes', require('./admin/skinType/skinType'));
router.use('/admin/brands', require('./admin/brand/brand'));
router.use('/admin/categories', require('./admin/category/category'));
router.use('/', require('./user/user'));


module.exports = router;