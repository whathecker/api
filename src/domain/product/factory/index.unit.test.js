const ProductFactory = require('./index');

describe('Test ProductFactory', () => {
    
    test('validateChannel must return false: invalid channel value', () => {
        const result = ProductFactory.validateChannel('US');
        expect(result).toBe(false);
    });

    test('validateChannel must return true', () => {
        const result = ProductFactory.validateChannel('EU');
        expect(result).toBe(true);
    });

    test('validateRegionInPrice must return false: invalid region value', () => {
        const result = ProductFactory.validateRegionInPrice('us');
        expect(result).toBe(false);
    });

    test('validateRegionInPrice must return true', () => {
        const result = ProductFactory.validateRegionInPrice('eu');
        expect(result).toBe(true);
    });

    test('validateCurrencyInPrice must return false: invalid currency value', () => {
        const result = ProductFactory.validateCurrencyInPrice('usd');
        expect(result).toBe(false);
    });

    test('validateCurrencyInPrice must return true', () => {
        const result = ProductFactory.validateCurrencyInPrice('euro');
        expect(result).toBe(true);
    });

    test('validatePriceFormat must return false: invalid price format', () => {
        const result = ProductFactory.validatePriceFormat('0');
        const result2 = ProductFactory.validatePriceFormat('some weird text');

        expect(result).toBe(false);
        expect(result2).toBe(false);
    }); 

    test('validatePriceFormat must return true', () => {
        const result = ProductFactory.validatePriceFormat('0.00');
        const result2 = ProductFactory.validatePriceFormat('999.00');
        const result3 = ProductFactory.validatePriceFormat('12314.99');
        const result4 = ProductFactory.validatePriceFormat('13134913.1');

        expect(result).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);
        expect(result4).toBe(true);
    });

    test('isPriceZero must return false', () => {
        const result = ProductFactory.isPriceZero('1.00');
        const result2 = ProductFactory.isPriceZero('111.00');
        const result3 = ProductFactory.isPriceZero('111.56');

        expect(result).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);
    });

    test('isPriceZero must return true', () => {
        const result = ProductFactory.isPriceZero('0.00');
        
        expect(result).toBe(true);
    });

    test('correctPriceDigit must return correct format of price', () => {
        const result = ProductFactory.correctPriceDigit('0');
        const result2 = ProductFactory.correctPriceDigit('88');
        const result3 = ProductFactory.correctPriceDigit('239032');

        expect(result).toBe('0.00');
        expect(result2).toBe('88.00');
        expect(result3).toBe('239032.00');
    });

    test('isVatExist must return false', () => {
        const vat = undefined;
        const result = ProductFactory.isVatExist(vat);

        expect(result).toBe(false);
    });

    test('isVatExist must return true', () => {
        const vat = "14.00";
        const result = ProductFactory.isVatExist(vat);

        expect(result).toBe(true);
    });

    test('isNetPriceExist must return false', () => {
        const netPrice = undefined;
        const result = ProductFactory.isVatExist(netPrice);

        expect(result).toBe(false);
    });

    test('isNetPriceExist must return true', () => {
        const netPrice = "14.00";
        const result = ProductFactory.isVatExist(netPrice);

        expect(result).toBe(true);
    });

    test('setVat must return correct vat value', () => {
        const result = ProductFactory.setVat('14.00', 'eu');
        const result2 = ProductFactory.setVat('111.00', 'eu');
        const result3 = ProductFactory.setVat('392334.23', 'eu');

        expect(result).toBe('2.43');
        expect(result2).toBe('19.26')
        expect(result3).toBe('68091.06');
    });

    test('setNetPrice must return correct vat value', () => {
        const result = ProductFactory.setNetPrice('145.01', 'eu');
        const result2 = ProductFactory.setNetPrice('1211.30', 'eu');
        const result3 = ProductFactory.setNetPrice('05.68', 'eu');

        expect(result).toBe('119.84');
        expect(result2).toBe('1001.07')
        expect(result3).toBe('4.69');
    });

    test('isProductIdExist must return false', () => {
        const id = undefined;
        const result = ProductFactory.isProductIdExist(id);

        expect(result).toBe(false);
    });

    test('isProductIdExist must return true', () => {
        const id = "MSST01235"
        const result = ProductFactory.isProductIdExist(id);

        expect(result).toBe(true);
    });

    test('createProductId must return correct product id format', () => {
        const brandCode = 'MS';
        const categoryCode = 'ST';
        const id = ProductFactory.createProductId(brandCode,categoryCode);

        expect(id).toHaveLength(9);
        expect(id.slice(0,2)).toBe('MS');
        expect(id.slice(2,4)).toBe('ST');
    });

    test('create_five_digits_integer must return 5 digit integer', () => {
        const num1 = ProductFactory.create_five_digits_integer();
        const num2 = ProductFactory.create_five_digits_integer();
        const num3 = ProductFactory.create_five_digits_integer();

        [num1, num2, num3].forEach((num) => {
            expect(num).toHaveLength(5);
        });

        expect(num1).not.toBe(num2);
        expect(num1).not.toBe(num3);
        expect(num2).not.toBe(num3);
    });
});