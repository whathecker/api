const buildCreateBrandObj = require('./brand');
const brandSchema = require('./brand-schema');
const validator = require('../validator')(brandSchema);

const makeBrandObj = buildCreateBrandObj(validator);

module.exports = makeBrandObj;