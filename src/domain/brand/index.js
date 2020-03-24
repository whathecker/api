const buildCreateBrandObj = require('./brand');
const brandSchema = require('./brand-schema');
const validator = require('../_shared_validator')(brandSchema);

const createBrandObj = buildCreateBrandObj(validator);

module.exports = createBrandObj;