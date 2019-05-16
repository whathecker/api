const router = require('express').Router();
const apiAuth = require('../../../middlewares/verifyApikey');
const getSubscription = require('../../../helpers/subscription/getSubscription');

router.get('/subscription/:subscriptionId', apiAuth, getSubscription);

module.exports = router;