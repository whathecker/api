const router = require('express').Router();
const logger = require('../../../utils/logger');
const SubscriptionBox = require('../../../models/SubscriptionBox');
const Product = require('../../../models/Product');
const subscriptionBoxIdPrefixes = require('../../../utils/subscriptionBoxIdPrefixes');
const apiAuth = require('../../../middlewares/verifyApikey');
const adminAuth = require('../../../middlewares/adminAuth');
const getSubscriptionBoxes = require('../../../helpers/subscriptionBox/getSubscriptionBoxes');
const getSubscriptionBoxById = require('../../../helpers/subscriptionBox/getSubscriptionBoxById');
const createSubscriptionBox = require('../../../helpers/subscriptionBox/createSubscriptionBox');
const updateSubscriptionBox = require('../../../helpers/subscriptionBox/updateSubscriptionBox');
const deleteSubscriptionBox = require('../../../helpers/subscriptionBox/deleteSubscriptionBox');

router.use(apiAuth);

// getSubscriptionBoxes is not adminAuth protected, as it's consumed at checkout
router.get('/', getSubscriptionBoxes);
router.get('/subscriptionBox/:id', adminAuth, getSubscriptionBoxById);
router.post('/subscriptionBox', adminAuth, createSubscriptionBox);
router.put('/subscriptionBox/:id', adminAuth, updateSubscriptionBox);
router.delete('/subscriptionBox/:id', adminAuth, deleteSubscriptionBox);

module.exports = router;