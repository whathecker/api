const buildCreateCategoryObj = require('./category');
const categorySchema = require('./category-schema');
const validator = require('../_shared_validator')(categorySchema);

const createCategoryObj = buildCreateCategoryObj(validator);

module.exports = createCategoryObj;