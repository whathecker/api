const buildCreateOrderObj = require('./order');
const orderSchema = require('./order-schema');
const validator = require('../_shared/validator')(orderSchema);


const createOrderObj = buildCreateOrderObj(validator);

module.exports = createOrderObj;