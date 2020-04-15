const adminUserSchema = require('./adminUser-schema');
const validator = require('../_shared/validator')(adminUserSchema);
const buildCreateAdminUserObj = require('./adminUser');

const createAdminUserObj = buildCreateAdminUserObj(validator);

module.exports = createAdminUserObj;