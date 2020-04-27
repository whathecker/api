const ProductFactory = require('./index');

describe('Test ProductFactory', () => {
    test('createProductId must return correct product id format', () => {
        const brandCode = 'MS';
        const categoryCode = 'ST';
        const productId = ProductFactory.createProductId(brandCode,categoryCode);

        expect(productId).toHaveLength(9);
        expect(productId.slice(0,2)).toBe('MS');
        expect(productId.slice(2,4)).toBe('ST');
    });
});