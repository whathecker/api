const buildCreateCheckoutObj = require('./checkout');
const checkoutSchema = require('./checkout-schema');
const validator = require('../_shared/validator')(checkoutSchema);

const createCheckoutObj = buildCreateCheckoutObj(validator);

module.exports = createCheckoutObj;