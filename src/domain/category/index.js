const buildCreateCategoryObj = require('./category');
const categorySchema = require('./category-schema');
const validator = require('../validator')(categorySchema);

const makeCategoryObj = buildCreateCategoryObj(validator);

module.exports = makeCategoryObj;