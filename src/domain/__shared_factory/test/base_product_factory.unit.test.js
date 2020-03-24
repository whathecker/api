const ProductBaseFactory = require('../base_product_factory');

describe('Test ProductBaseFactory', () => {

    test('validateChannel must return false: invalid channel value', () => {
        const result = ProductBaseFactory.validateChannel('US');
        expect(result).toBe(false);
    });

    test('validateChannel must return true', () => {
        const result = ProductBaseFactory.validateChannel('EU');
        expect(result).toBe(true);
    });

    test('validateRegionInPrice must return false: invalid region value', () => {
        const result = ProductBaseFactory.validateRegionInPrice('us');
        expect(result).toBe(false);
    });

    test('validateRegionInPrice must return true', () => {
        const result = ProductBaseFactory.validateRegionInPrice('eu');
        expect(result).toBe(true);
    });

    test('validateCurrencyInPrice must return false: invalid currency value', () => {
        const result = ProductBaseFactory.validateCurrencyInPrice('usd');
        expect(result).toBe(false);
    });

    test('validateCurrencyInPrice must return true', () => {
        const result = ProductBaseFactory.validateCurrencyInPrice('euro');
        expect(result).toBe(true);
    });

    test('validatePriceFormat must return false: invalid price format', () => {
        const result = ProductBaseFactory.validatePriceFormat('0');
        const result2 = ProductBaseFactory.validatePriceFormat('some weird text');

        expect(result).toBe(false);
        expect(result2).toBe(false);
    }); 

    test('validatePriceFormat must return true', () => {
        const result = ProductBaseFactory.validatePriceFormat('0.00');
        const result2 = ProductBaseFactory.validatePriceFormat('999.00');
        const result3 = ProductBaseFactory.validatePriceFormat('12314.99');
        const result4 = ProductBaseFactory.validatePriceFormat('13134913.1');

        expect(result).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);
        expect(result4).toBe(true);
    });

    test('isPriceZero must return false', () => {
        const result = ProductBaseFactory.isPriceZero('1.00');
        const result2 = ProductBaseFactory.isPriceZero('111.00');
        const result3 = ProductBaseFactory.isPriceZero('111.56');

        expect(result).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);
    });

    test('isPriceZero must return true', () => {
        const result = ProductBaseFactory.isPriceZero('0.00');
        
        expect(result).toBe(true);
    });

    test('correctPriceDigit must return correct format of price', () => {
        const result = ProductBaseFactory.correctPriceDigit('0');
        const result2 = ProductBaseFactory.correctPriceDigit('88');
        const result3 = ProductBaseFactory.correctPriceDigit('239032');

        expect(result).toBe('0.00');
        expect(result2).toBe('88.00');
        expect(result3).toBe('239032.00');
    });

    test('isVatExist must return false', () => {
        const vat = undefined;
        const result = ProductBaseFactory.isVatExist(vat);

        expect(result).toBe(false);
    });

    test('isVatExist must return true', () => {
        const vat = "14.00";
        const result = ProductBaseFactory.isVatExist(vat);

        expect(result).toBe(true);
    });

    test('isNetPriceExist must return false', () => {
        const netPrice = undefined;
        const result = ProductBaseFactory.isVatExist(netPrice);

        expect(result).toBe(false);
    });

    test('isNetPriceExist must return true', () => {
        const netPrice = "14.00";
        const result = ProductBaseFactory.isVatExist(netPrice);

        expect(result).toBe(true);
    });

    test('setVat must return correct vat value', () => {
        const result = ProductBaseFactory.setVat('14.00', 'eu');
        const result2 = ProductBaseFactory.setVat('111.00', 'eu');
        const result3 = ProductBaseFactory.setVat('392334.23', 'eu');

        expect(result).toBe('2.43');
        expect(result2).toBe('19.26')
        expect(result3).toBe('68091.06');
    });

    test('setNetPrice must return correct vat value', () => {
        const result = ProductBaseFactory.setNetPrice('145.01', 'eu');
        const result2 = ProductBaseFactory.setNetPrice('1211.30', 'eu');
        const result3 = ProductBaseFactory.setNetPrice('05.68', 'eu');

        expect(result).toBe('119.84');
        expect(result2).toBe('1001.07')
        expect(result3).toBe('4.69');
    });

    test('isProductIdExist must return false', () => {
        /*
        const id = undefined;
        const result = ProductFactory.isProductIdExist(id);

        expect(result).toBe(false); */
    });

    test('isProductIdExist must return true', () => {
        /*
        const id = "MSST01235"
        const result = ProductFactory.isProductIdExist(id);

        expect(result).toBe(true); */
    });

    test('createProductId must return correct product id format', () => {
        /*
        const brandCode = 'MS';
        const categoryCode = 'ST';
        const id = ProductFactory.createProductId(brandCode,categoryCode);

        expect(id).toHaveLength(9);
        expect(id.slice(0,2)).toBe('MS');
        expect(id.slice(2,4)).toBe('ST'); */
    });

    test('create_five_digits_integer must return 5 digit integer', () => {
        const num1 = ProductBaseFactory.create_five_digits_integer();
        const num2 = ProductBaseFactory.create_five_digits_integer();
        const num3 = ProductBaseFactory.create_five_digits_integer();

        [num1, num2, num3].forEach((num) => {
            expect(num).toHaveLength(5);
        });

        expect(num1).not.toBe(num2);
        expect(num1).not.toBe(num3);
        expect(num2).not.toBe(num3);
    });
});