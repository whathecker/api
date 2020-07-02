const buildCreateCartObj = require('./cart');
const cartSchema = require('./cart-schema');
const validator = require('../_shared/validator')(cartSchema);

const createCartObj = buildCreateCartObj(validator);

module.exports = createCartObj;