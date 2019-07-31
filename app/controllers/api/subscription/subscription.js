const router = require('express').Router();
const apiAuth = require('../../../middlewares/verifyApikey');
const adminAuth = require('../../../middlewares/adminAuth');
const getSubscriptions = require('../../../helpers/subscription/getSubscriptions');
const getSubscriptionById = require('../../../helpers/subscription/getSubscriptionById');
const initiateRecurringProcess = require('../../../helpers/subscription/initiateRecurringProcess');

router.use(apiAuth);
router.get('/', adminAuth, getSubscriptions);
router.get('/payments/recurring/:attempt', initiateRecurringProcess);
router.get('/subscription/:id', adminAuth, getSubscriptionById);

module.exports = router;