const buildCreateProductObj = require('./product');
const productSchema = require('./product-schema');
const validator = require('../validator')(productSchema);

const createProductObj = buildCreateProductObj(validator);

module.exports = createProductObj;