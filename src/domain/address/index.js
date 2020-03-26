const buildCreateAddressObj = require('./address');
const addressSchema = require('./address-schema');
const validator = require('../_shared_validator')(addressSchema);

const createAddressObj = buildCreateAddressObj(validator);

module.exports = createAddressObj;
