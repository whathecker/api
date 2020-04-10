const buildCreateBrandObj = require('./brand');
const brandSchema = require('./brand-schema');
const validator = require('../_shared/validator')(brandSchema);

const createBrandObj = buildCreateBrandObj(validator);

module.exports = createBrandObj;