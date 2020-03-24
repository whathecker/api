const buildCreateSubscriptionBoxObj = require('./subscriptionBox');
const subscriptionBoxSchema = require('./subscriptionBox-schema');
const validator = require('../validator')(validator);

const createSubscriptionBoxObj = buildCreateSubscriptionBoxObj(validator);

module.exports = createSubscriptionBoxObj;