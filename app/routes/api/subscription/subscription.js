const router = require('express').Router();
const apiAuth = require('../../../middlewares/verifyApikey');
const adminAuth = require('../../../middlewares/adminAuth');
const getSubscriptions = require('../../../controllers/subscription/getSubscriptions');
const getSubscriptionById = require('../../../controllers/subscription/getSubscriptionById');
const initiateRecurringProcess = require('../../../controllers/subscription/initiateRecurringProcess');
const changeSubscriptionStatus = require('../../../controllers/subscription/changeSubscriptionStatus');
const fetchRecurringBatch = require('../../../controllers/subscription/fetchRecurringBatch');

router.use(apiAuth);
router.get('/', adminAuth, getSubscriptions);
router.get('/payments/recurring/:attempt', fetchRecurringBatch);
router.put('/subscription/:id/status', adminAuth, changeSubscriptionStatus);
router.get('/subscription/:id', adminAuth, getSubscriptionById);


module.exports = router;