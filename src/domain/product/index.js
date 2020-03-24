const buildCreateProductObj = require('./product');
const productSchema = require('./product-schema');
const validator = require('../_shared_validator')(productSchema);

const createProductObj = buildCreateProductObj(validator);

module.exports = createProductObj;