const errors = require('./address-error');
const buildCreateAddressObj = require('./address');
const addressSchema = require('./address-schema');
const validator = require('../_shared_validator')(addressSchema);
const createAddressObj = buildCreateAddressObj(validator);

describe('Type checking: address object', () => {

    test('address object must have a channel property', () => {
        let payload = copyObj(dummyData);
        delete payload.channel;
        
        const address = createAddressObj(payload);

        expect(address instanceof Error).toBe(true);
        expect(address.message).toBe(errors.typeErrors.channel.message);
    });

    test('channel property must be string', () => {
        let payload = copyObj(dummyData);
        payload.channel = 0;

        const address = createAddressObj(payload);

        expect(address instanceof Error).toBe(true);
        expect(address.message).toBe(errors.typeErrors.channel.message);
    });
});