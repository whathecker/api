const userSchema = require('./user-schema');
const validator = require('../_shared/validator')(userSchema);
const buildCreateUserObj = require('./user');

const createUserObj = buildCreateUserObj(validator);

module.exports = createUserObj;