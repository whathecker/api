const ProductFactory = require('./index');

describe('Test ProductFactory', () => {
    test('createProductId must return correct product id format', () => {
        const brandCode = 'MS';
        const categoryCode = 'ST';
        const id = ProductFactory.createProductId(brandCode,categoryCode);

        expect(id).toHaveLength(9);
        expect(id.slice(0,2)).toBe('MS');
        expect(id.slice(2,4)).toBe('ST');
    });
});