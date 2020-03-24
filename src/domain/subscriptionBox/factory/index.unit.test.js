const SubscriptionBoxFactory = require('./index');

describe('Test SubscriptionBoxFactory', () => {
    test('createSubscriptionBoxId must return correct product id format', () => {
        const boxTypeCode = 'NM';
        const id = SubscriptionBoxFactory.createSubscriptionBoxId(boxTypeCode);

        expect(id).toHaveLength(9);
        expect(id.slice(0,2)).toBe('PK');
        expect(id.slice(2,4)).toBe('NM');
    });
});