const OrderFactory = require('./index');

describe('Test OrderFactory', () => {

    test('validateOrderNumberFormat must return true', () => {
        const orderNumber = "DVNL10101";
        const orderNumber2 = "STNL12315";
        const orderNumber3 = "ECNL49201";

        const result = OrderFactory.validateOrderNumberFormat(orderNumber);
        const result2 = OrderFactory.validateOrderNumberFormat(orderNumber2);
        const result3 = OrderFactory.validateOrderNumberFormat(orderNumber3);

        expect(result).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);
    });

    test('validateOrderNumberFormat must return false', () => {
        const orderNumber = "XXDE12301";
        const orderNumber2 = "DVNL101011";
        const orderNumber3 = "ECUS12020";

        const result = OrderFactory.validateOrderNumberFormat(orderNumber);
        const result2 = OrderFactory.validateOrderNumberFormat(orderNumber2);
        const result3 = OrderFactory.validateOrderNumberFormat(orderNumber3);

        expect(result).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);
    });

    test('validate_env_prefix must return true', () => {
        const envPrefix = "DV";
        const envPrefix2 = "ST";
        const envPrefix3 = "EC";

        const result = OrderFactory.validate_env_prefix(envPrefix);
        const result2 = OrderFactory.validate_env_prefix(envPrefix2);
        const result3 = OrderFactory.validate_env_prefix(envPrefix3);

        expect(result).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);
    });

    test('validate_env_prefix must return false', () => {
        const envPrefix = "XX";
        const envPrefix2 = "VS";
        const envPrefix3 = "WS";

        const result = OrderFactory.validate_env_prefix(envPrefix);
        const result2 = OrderFactory.validate_env_prefix(envPrefix2);
        const result3 = OrderFactory.validate_env_prefix(envPrefix3);

        expect(result).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);
    });

    test('validate_country_prefix must return true', () => {
        const countryPrefix = "NL";
    
        const result = OrderFactory.validate_country_prefix(countryPrefix);
      
        expect(result).toBe(true);
    });

    test('validate_country_prefix must return false', () => {
        const countryPrefix = "DE";
    
        const result = OrderFactory.validate_country_prefix(countryPrefix);
      
        expect(result).toBe(false);
    });
});