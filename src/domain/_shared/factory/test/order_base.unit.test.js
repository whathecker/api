const OrderBaseFactory = require('../order_base');

describe('Test OrderBaseFactory', () => {

    test('get_env_prefix must return null', () => {
        const envVar = "new";

        const envPrefix = OrderBaseFactory.get_env_prefix(envVar);

        expect(envPrefix).toBe(null);
    });

    test('get_env_prefix must return correct prefix', () => {
        const envPrefix = OrderBaseFactory.get_env_prefix("test");
        const envPrefix2 = OrderBaseFactory.get_env_prefix("local");
        const envPrefix3 = OrderBaseFactory.get_env_prefix("development");
        const envPrefix4 = OrderBaseFactory.get_env_prefix("staging");
        const envPrefix5 = OrderBaseFactory.get_env_prefix("production");
        
        expect(envPrefix).toBe("DV");
        expect(envPrefix2).toBe("DV");
        expect(envPrefix3).toBe("DV");
        expect(envPrefix4).toBe("ST");
        expect(envPrefix5).toBe("EC");
    });

    test('get_country_prefix must return undefined', () => {
        const country = "new";

        const countryPrefix = OrderBaseFactory.get_country_prefix(country);

        expect(countryPrefix).toBe(null);
    });

    test('get_country_prefix must return correct prefix', () => {
        const country = "NL";

        const countryPrefix = OrderBaseFactory.get_country_prefix(country);

        expect(countryPrefix).toBe("NL");
    });

    test('validate_currency must return true', () => {
        const result = OrderBaseFactory.validate_currency('euro');

        expect(result).toBe(true);
    });

    test('validate_currency must return false', () => {
        const result = OrderBaseFactory.validate_currency('usd');

        expect(result).toBe(false);
    });

    test('validate_qty_of_item must return true', () => {
        const result = OrderBaseFactory.validate_qty_of_item(1);
        const result2 = OrderBaseFactory.validate_qty_of_item(10001);

        expect(result).toBe(true);
        expect(result2).toBe(true);
    });

    test('validate_qty_of_item must return false', () => {
        const result = OrderBaseFactory.validate_qty_of_item(0);
        const result2 = OrderBaseFactory.validate_qty_of_item(-1);

        expect(result).toBe(false);
        expect(result2).toBe(false);
    });

    test('calculate_price_delta must return correct value', () => {
        const deltaPrice = OrderBaseFactory.calculate_price_delta("100.00", "20.00");
        const deltaPrice2 = OrderBaseFactory.calculate_price_delta("101.01", "90.00");
        const deltaPrice3 = OrderBaseFactory.calculate_price_delta("101.01", "88.15");
        const deltaPrice4 = OrderBaseFactory.calculate_price_delta("1560.00", "20.00");
        const deltaPrice5 = OrderBaseFactory.calculate_price_delta("111.11", "90.00");

        expect(deltaPrice).toBe("80.00");
        expect(deltaPrice2).toBe("11.01");
        expect(deltaPrice3).toBe("12.86");
        expect(deltaPrice4).toBe("1540.00");
        expect(deltaPrice5).toBe("21.11");
    });

    test('calculate_price_multiply_qty must return correct value', () => {
        const multipliedPrice = OrderBaseFactory.calculate_price_multiply_qty("10.00", 2);
        const multipliedPrice2 = OrderBaseFactory.calculate_price_multiply_qty("10.00", 100123);
        const multipliedPrice3 = OrderBaseFactory.calculate_price_multiply_qty("151.01", 4);
        const multipliedPrice4 = OrderBaseFactory.calculate_price_multiply_qty('1600.05', 5);

        expect(multipliedPrice).toBe("20.00");
        expect(multipliedPrice2).toBe("1001230.00");
        expect(multipliedPrice3).toBe('604.04');
        expect(multipliedPrice4).toBe('8000.25');
    });

});