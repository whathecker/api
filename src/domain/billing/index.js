const buildCreateBillingObj = require('./billing');
const billingSchema = require('./billing-schema');
const validator = require('../_shared/validator')(billingSchema);

const createBillingObj = buildCreateBillingObj(validator);

module.exports = createBillingObj;