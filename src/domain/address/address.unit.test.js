const errors = require('./address-error');
const buildCreateAddressObj = require('./address');
const addressSchema = require('./address-schema');
const validator = require('../_shared_validator')(addressSchema);
const createAddressObj = buildCreateAddressObj(validator);

const dummyData = {
    user: "some key",
    firstName: "Yunjae",
    lastName: "Oh",
    mobileNumber: "0612345678",
    postalCode: "1093TV",
    houseNumber: "100",
    houseNumberAdd: undefined,
    streetName: "Randomstraat",
    city: "Amsterdam",
    province: "North-Holland",
    country: "Netherlands",
    creationDate: new Date('December 17, 1995 03:24:00'),
    lastModified: new Date('December 17, 1999 03:24:00')
}

function copyObj(obj) {
    return JSON.parse(JSON.stringify(obj));
}

describe('Type checking: address object', () => {

    test('address object must have a user property', () => {
        let payload = copyObj(dummyData);
        delete payload.user;
        
        const address = createAddressObj(payload);

        expect(address instanceof Error).toBe(true);
        expect(address.message).toBe(errors.typeErrors.user.message);
    });

    test('user property must be string', () => {
        let payload = copyObj(dummyData);
        payload.user = 0;

        const address = createAddressObj(payload);

        expect(address instanceof Error).toBe(true);
        expect(address.message).toBe(errors.typeErrors.user.message);
    });

    test('address object must have a firstName property', () => {
        let payload = copyObj(dummyData);
        delete payload.firstName;
        
        const address = createAddressObj(payload);

        expect(address instanceof Error).toBe(true);
        expect(address.message).toBe(errors.typeErrors.firstName.message);
    });

    test('firstName property must be string', () => {
        let payload = copyObj(dummyData);
        payload.firstName = 0;

        const address = createAddressObj(payload);

        expect(address instanceof Error).toBe(true);
        expect(address.message).toBe(errors.typeErrors.firstName.message);
    });

    test('address object must have a lastName property', () => {
        let payload = copyObj(dummyData);
        delete payload.lastName;
        
        const address = createAddressObj(payload);

        expect(address instanceof Error).toBe(true);
        expect(address.message).toBe(errors.typeErrors.lastName.message);
    });

    test('lastName property must be string', () => {
        let payload = copyObj(dummyData);
        payload.lastName = 0;

        const address = createAddressObj(payload);

        expect(address instanceof Error).toBe(true);
        expect(address.message).toBe(errors.typeErrors.lastName.message);
    });

    test('mobileNumber property must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.mobileNumber = true;

        const address = createAddressObj(payload);

        expect(address instanceof Error).toBe(true);
        expect(address.message).toBe(errors.typeErrors.mobileNumber.message);
    });

    test('address object must have a postalCode property', () => {
        let payload = copyObj(dummyData);
        delete payload.postalCode;
        
        const address = createAddressObj(payload);

        expect(address instanceof Error).toBe(true);
        expect(address.message).toBe(errors.typeErrors.postalCode.message);
    });

    test('postalCode property must be string', () => {
        let payload = copyObj(dummyData);
        payload.postalCode = 0;

        const address = createAddressObj(payload);

        expect(address instanceof Error).toBe(true);
        expect(address.message).toBe(errors.typeErrors.postalCode.message);
    });

    test('address object must have a houseNumber property', () => {
        let payload = copyObj(dummyData);
        delete payload.houseNumber;
        
        const address = createAddressObj(payload);

        expect(address instanceof Error).toBe(true);
        expect(address.message).toBe(errors.typeErrors.houseNumber.message);
    });

    test('houseNumber property must be string', () => {
        let payload = copyObj(dummyData);
        payload.houseNumber = 0;

        const address = createAddressObj(payload);

        expect(address instanceof Error).toBe(true);
        expect(address.message).toBe(errors.typeErrors.houseNumber.message);
    });

    test('houseNumberAdd property must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.houseNumberAdd = true;

        const address = createAddressObj(payload);

        expect(address instanceof Error).toBe(true);
        expect(address.message).toBe(errors.typeErrors.houseNumberAdd.message);
    });

    test('address object must have a streetName property', () => {
        let payload = copyObj(dummyData);
        delete payload.streetName;
        
        const address = createAddressObj(payload);

        expect(address instanceof Error).toBe(true);
        expect(address.message).toBe(errors.typeErrors.streetName.message);
    });

    test('streetName property must be string', () => {
        let payload = copyObj(dummyData);
        payload.streetName = 0;

        const address = createAddressObj(payload);

        expect(address instanceof Error).toBe(true);
        expect(address.message).toBe(errors.typeErrors.streetName.message);
    });

    test('address object must have a city property', () => {
        let payload = copyObj(dummyData);
        delete payload.city;
        
        const address = createAddressObj(payload);

        expect(address instanceof Error).toBe(true);
        expect(address.message).toBe(errors.typeErrors.city.message);
    });

    test('city property must be string', () => {
        let payload = copyObj(dummyData);
        payload.city = 0;

        const address = createAddressObj(payload);

        expect(address instanceof Error).toBe(true);
        expect(address.message).toBe(errors.typeErrors.city.message);
    });

    test('province property must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.province = true;

        const address = createAddressObj(payload);

        expect(address instanceof Error).toBe(true);
        expect(address.message).toBe(errors.typeErrors.province.message);
    });

    test('address object must have a country property', () => {
        let payload = copyObj(dummyData);
        delete payload.country;
        
        const address = createAddressObj(payload);

        expect(address instanceof Error).toBe(true);
        expect(address.message).toBe(errors.typeErrors.country.message);
    });

    test('country property must be string', () => {
        let payload = copyObj(dummyData);
        payload.country = 0;

        const address = createAddressObj(payload);

        expect(address instanceof Error).toBe(true);
        expect(address.message).toBe(errors.typeErrors.country.message);
    });

    test('creationDate property must be date if exist', () => {
        let payload = copyObj(dummyData);
        payload.creationDate = 'weird odd text';

        const address = createAddressObj(payload);

        expect(address instanceof Error).toBe(true);
        expect(address.message).toBe(errors.typeErrors.creationDate.message);
    });

    test('lastModified property must be date if exist', () => {
        let payload = copyObj(dummyData);
        payload.lastModified = 'weird odd text';

        const address = createAddressObj(payload);

        expect(address instanceof Error).toBe(true);
        expect(address.message).toBe(errors.typeErrors.lastModified.message);
    });

});