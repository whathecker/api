const router = require('express').Router();
const apiAuth = require('../../../middlewares/verifyApikey');
const adminAuth = require('../../../middlewares/adminAuth');
const getOrders = require('../../../controllers/orders/getOrders');
const getOrderByOrdernumber = require('../../../controllers/orders/getOrderByOrdernumber');
const updateShippingItems = require('../../../controllers/orders/updateShippingItems');
const removePackedItems = require('../../../controllers/orders/removePackedItems');
const updateShippingStatus = require('../../../controllers/orders/updateShippingStatus');

router.use(apiAuth);

router.get('/', adminAuth, getOrders);
router.get('/order/:ordernumber', adminAuth, getOrderByOrdernumber);
router.put('/order/:ordernumber/shipping', adminAuth, updateShippingStatus);
router.put('/order/:ordernumber/shipping/items', adminAuth, updateShippingItems);
router.delete('/order/:ordernumber/shipping/items/:itemId', adminAuth, removePackedItems);

module.exports = router;