const router = require('express').Router();
const apiAuth = require('../../../middlewares/verifyApikey');
const adminAuth = require('../../../middlewares/adminAuth');
const getSubscriptions = require('../../../helpers/subscription/getSubscriptions');
const getSubscriptionById = require('../../../helpers/subscription/getSubscriptionById');
const initiateRecurringProcess = require('../../../helpers/subscription/initiateRecurringProcess');
const changeSubscriptionStatus = require('../../../helpers/subscription/changeSubscriptionStatus');

router.use(apiAuth);
router.get('/', adminAuth, getSubscriptions);
router.get('/payments/recurring/:attempt', initiateRecurringProcess);
router.put('/subscription/:id/status', adminAuth, changeSubscriptionStatus);
router.get('/subscription/:id', adminAuth, getSubscriptionById);


module.exports = router;