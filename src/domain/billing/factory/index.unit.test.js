const BillingFactory = require('./index');

describe('Test BillingFactory', () => {

    test('validateTokenRefundStatus must return true', () => {
        const ressult = BillingFactory.validateTokenRefundStatus("NOT_REQUIRED");
        const result2 = BillingFactory.validateTokenRefundStatus("REQUIRED");
        const result3 = BillingFactory.validateTokenRefundStatus("REFUNDED");

        expect(ressult).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);
    });

    test('validateTokenRefundStatus must return false: invalid status', () => {
        const result = BillingFactory.validateTokenRefundStatus('TO_BE_REFUNDED');

        expect(result).toBe(false);
    });

});