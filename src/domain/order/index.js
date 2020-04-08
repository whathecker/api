const buildCreateOrderObj = require('./order');
const orderSchema = require('./order-schema');
const validator = require('../_shared_validator')(orderSchema);


const createOrderObj = buildCreateOrderObj(validator);

module.exports = createOrderObj;