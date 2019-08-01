const router = require('express').Router();
const apiAuth = require('../../../middlewares/verifyApikey');
const adminAuth = require('../../../middlewares/adminAuth');
const getOrders = require('../../../helpers/orders/getOrders');
const getOrderByOrdernumber = require('../../../helpers/orders/getOrderByOrdernumber');
const updateShippingItems = require('../../../helpers/orders/updateShippingItems');
const removePackedItems = require('../../../helpers/orders/removePackedItems');
const updateShippingStatus = require('../../../helpers/orders/updateShippingStatus');

router.use(apiAuth);

router.get('/', adminAuth, getOrders);
router.get('/order/:id', adminAuth, getOrderByOrdernumber);
router.put('/order/:id/shipping', adminAuth, updateShippingStatus);
router.put('/order/:id/shipping/items', adminAuth, updateShippingItems);
router.delete('/order/:id/shipping/items/:item', adminAuth, removePackedItems);

module.exports = router;