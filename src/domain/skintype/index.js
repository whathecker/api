const buildCreateSkinTypeObj = require('./skinType');
const skinTypeSchema = require('./skinType-schema');
const validator = require('../_shared/validator')(skinTypeSchema);

const createSkinTypeObj = buildCreateSkinTypeObj(validator);

module.exports = createSkinTypeObj;