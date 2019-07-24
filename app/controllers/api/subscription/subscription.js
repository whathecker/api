const router = require('express').Router();
const apiAuth = require('../../../middlewares/verifyApikey');
const adminAuth = require('../../../middlewares/adminAuth');
const getSubscriptions = require('../../../helpers/subscription/getSubscriptions');
const getSubscriptionById = require('../../../helpers/subscription/getSubscriptionById');

router.use(apiAuth);
router.get('/', adminAuth, getSubscriptions);
router.get('/subscription/:id', adminAuth, getSubscriptionById);

module.exports = router;