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

    test('get_env_prefix must return null', () => {
        const envVar = "new";

        const envPrefix = OrderFactory.get_env_prefix(envVar);

        expect(envPrefix).toBe(null);
    });

    test('get_env_prefix must return correct prefix', () => {
        const envPrefix = OrderFactory.get_env_prefix("test");
        const envPrefix2 = OrderFactory.get_env_prefix("local");
        const envPrefix3 = OrderFactory.get_env_prefix("development");
        const envPrefix4 = OrderFactory.get_env_prefix("staging");
        const envPrefix5 = OrderFactory.get_env_prefix("production");
        
        expect(envPrefix).toBe("DV");
        expect(envPrefix2).toBe("DV");
        expect(envPrefix3).toBe("DV");
        expect(envPrefix4).toBe("ST");
        expect(envPrefix5).toBe("EC");
    });

    test('get_country_prefix must return undefined', () => {
        const country = "new";

        const countryPrefix = OrderFactory.get_country_prefix(country);

        expect(countryPrefix).toBe(null);
    });

    test('get_country_prefix must return correct prefix', () => {
        const country = "netherlands";

        const countryPrefix = OrderFactory.get_country_prefix(country);

        expect(countryPrefix).toBe("NL");
    });

    test('createOrderNumber must return valid orderNumber', () => {
        const envPrefix = OrderFactory.get_env_prefix('production');
        const countryPrefix = OrderFactory.get_country_prefix('netherlands');
        const orderNumber = OrderFactory.createOrderNumber({
            envPrefix: envPrefix,
            countryPrefix: countryPrefix
        });

        const envPrefix2 = OrderFactory.get_env_prefix('staging');
        const countryPrefix2 = OrderFactory.get_country_prefix('netherlands');
        const orderNumber2 = OrderFactory.createOrderNumber({
            envPrefix: envPrefix2,
            countryPrefix: countryPrefix2
        });

        const envPrefix3 = OrderFactory.get_env_prefix('new');
        const countryPrefix3 = OrderFactory.get_country_prefix('new');
        const orderNumber3 = OrderFactory.createOrderNumber({
            envPrefix: envPrefix3,
            countryPrefix: countryPrefix3
        });

        expect(orderNumber).toHaveLength(9);
        expect(orderNumber.slice(0,2)).toBe('EC');
        expect(orderNumber.slice(2,4)).toBe('NL');

        expect(orderNumber2).toHaveLength(9);
        expect(orderNumber2.slice(0,2)).toBe('ST');
        expect(orderNumber2.slice(2,4)).toBe('NL');

        expect(orderNumber3).toHaveLength(9);
        expect(orderNumber3.slice(0,2)).toBe('DV');
        expect(orderNumber3.slice(2,4)).toBe('NL');
    });

    test('validateInvoiceNumber must return true', () => {
        const invoiceNumber = "0805081926622";

        const result = OrderFactory.validateInvoiceNumber(invoiceNumber);

        expect(result).toBe(true);
    });

    test('validateInvoiceNumber must return false', () => {
        const invoiceNumber = "080508192662211";

        const result = OrderFactory.validateInvoiceNumber(invoiceNumber);

        expect(result).toBe(false);
    });

    test('validateOrderStatus must return true', () => {
        const orderStatus = {
            status: 'RECEIVED',
            timestamp: new Date('December 17, 1995 03:24:00')
        };
        const orderStatus2 = {
            status: 'PENDING',
            timestamp: new Date('December 18, 1995 03:24:00')
        };
        const orderStatus3 = {
            status: 'PAID',
            timestamp: new Date('December 19, 1995 03:24:00')
        };
        const orderStatus4 = {
            status: 'SHIPPED',
            timestamp: new Date('December 20, 1995 03:24:00')
        };
        const orderStatus5 = {
            status: 'CANCELLED',
            timestamp: new Date('December 21, 1995 03:24:00')
        };
        const orderStatus6 = {
            status: 'OVERDUE',
            timestamp: new Date('December 22, 1995 03:24:00')
        };

        const result = OrderFactory.validateOrderStatus(orderStatus);
        const result2 = OrderFactory.validateOrderStatus(orderStatus2);
        const result3 = OrderFactory.validateOrderStatus(orderStatus3);
        const result4 = OrderFactory.validateOrderStatus(orderStatus4);
        const result5 = OrderFactory.validateOrderStatus(orderStatus5);
        const result6 = OrderFactory.validateOrderStatus(orderStatus6);
        
        expect(result).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);
        expect(result4).toBe(true);
        expect(result5).toBe(true);
        expect(result6).toBe(true);
    });

    test('validateOrderStatus must return true', () => {
        const orderStatus = {
            status: 'TOBEPAID',
            timestamp: new Date('December 17, 1995 03:24:00')
        };
        
        const result = OrderFactory.validateOrderStatus(orderStatus);
        
        expect(result).toBe(false);
    });
});