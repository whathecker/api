const DutchAddressFactory = require('./index');

describe('Test DutchAddressFactory', () => {

    // technical dept alert enhance validation rule 
    // in orderto support multiple prefixes of dutch phone number

    test('validateMobileNumber must return true', () => {
        const result = DutchAddressFactory.validateMobileNumber("0612345678");
        expect(result).toBe(true);
    });

    test('validateMobileNumber must return false: invalid mobileNumber', () => {
        const result = DutchAddressFactory.validateMobileNumber("+310612345678");
        expect(result).toBe(false);
    });

    test('validatePostalCode must return true', () => {
        const result = DutchAddressFactory.validatePostalCode("1034WK");
        expect(result).toBe(true);
    });

    test('validatePostalCode must return false: invalid postalCode contain 3 digits and 2 letters', () => {
        const result = DutchAddressFactory.validatePostalCode("103WK");
        expect(result).toBe(false);
    });

    test('validatePostalCode must return false: invalid postalCode contain 4 digits and 1 letters', () => {
        const result = DutchAddressFactory.validatePostalCode("1034W");
        expect(result).toBe(false);
    });

    test('validatePostalCode must return false: invalid postalCode contain 2 digits before 3 letters', () => {
        const result = DutchAddressFactory.validatePostalCode("10WAA");
        expect(result).toBe(false);
    });

    test('validatePostalCode must return false: invalid postalCode contain 10 digits before 3 letters', () => {
        const result = DutchAddressFactory.validatePostalCode("1011112345WAA");
        expect(result).toBe(false);
    });

    test('validatePostalCode must return false: postalCode cannot contain SS, SD, SA', () => {
        const result = DutchAddressFactory.validatePostalCode("1034SS");
        const result2 = DutchAddressFactory.validatePostalCode("1034SD");
        const result3 = DutchAddressFactory.validatePostalCode("1034SA");

        expect(result).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);
    });

    test('validateHouseNumber must return true', () => {
        const result = DutchAddressFactory.validateHouseNumber("12093");
        expect(result).toBe(true);
    });

    test('validateHouseNumber must return false: invalid houseNumber', () => {
        const result = DutchAddressFactory.validateHouseNumber("1209342");
        expect(result).toBe(false);
    });
});