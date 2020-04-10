const buildCreateSubscriptionBoxObj = require('./subscriptionBox');
const subscriptionBoxSchema = require('./subscriptionBox-schema');
const validator = require('../_shared/validator')(subscriptionBoxSchema);

const createSubscriptionBoxObj = buildCreateSubscriptionBoxObj(validator);

module.exports = createSubscriptionBoxObj;