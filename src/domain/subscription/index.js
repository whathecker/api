const buildCreateSubscriptionObj = require('./subscription');
const subscriptionSchema = require('./subscription-schema');
const validator = require('../_shared/validator')(subscriptionSchema);

const createSubscriptionObj = buildCreateSubscriptionObj(validator);

module.exports = createSubscriptionObj;