const errors = require('./billing-error');
const buildCreateBillingObj = require('./billing');
const billingSchema = require('./billing-schema');
const validator = require('../_shared_validator')(billingSchema);
const createBillingObj = buildCreateBillingObj(validator);

const dummyData = {
    user: "some key",
    type: "mastercard",
    recurringDetail: undefined,
    billingId: "pm_1FFGmfAwZopNuXPMgSYvNPDs",
    tokenRefundStatus: "NOT_REQUIRED",
    creationDate: new Date('December 17, 1995 03:24:00'),
    lastModified: new Date('December 17, 1999 03:24:00')
};

function copyObj(obj) {
    return JSON.parse(JSON.stringify(obj));
}

describe('Type checking: billing object', () => {

    test('billing object must have a user property', () => {
        let payload = copyObj(dummyData);
        delete payload.user;
        
        const billing = createBillingObj(payload);

        expect(billing instanceof Error).toBe(true);
        expect(billing.message).toBe(errors.typeErrors.user.message);
    });

    test('user property must be string', () => {
        let payload = copyObj(dummyData);
        payload.user = 0;

        const billing = createBillingObj(payload);

        expect(billing instanceof Error).toBe(true);
        expect(billing.message).toBe(errors.typeErrors.user.message);
    });

    test('billing object must have a type property', () => {
        let payload = copyObj(dummyData);
        delete payload.type;
        
        const billing = createBillingObj(payload);

        expect(billing instanceof Error).toBe(true);
        expect(billing.message).toBe(errors.typeErrors.type.message);
    });

    test('type property must be string', () => {
        let payload = copyObj(dummyData);
        payload.type = 0;

        const billing = createBillingObj(payload);

        expect(billing instanceof Error).toBe(true);
        expect(billing.message).toBe(errors.typeErrors.type.message);
    });

    test('recurringDetail property must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.recurringDetail = true;

        const billing = createBillingObj(payload);

        expect(billing instanceof Error).toBe(true);
        expect(billing.message).toBe(errors.typeErrors.recurringDetail.message);
    });

    test('billing object must have a billingId property', () => {
        let payload = copyObj(dummyData);
        delete payload.billingId;
        
        const billing = createBillingObj(payload);

        expect(billing instanceof Error).toBe(true);
        expect(billing.message).toBe(errors.typeErrors.billingId.message);
    });

    test('billingId property must be string', () => {
        let payload = copyObj(dummyData);
        payload.billingId = 0;

        const billing = createBillingObj(payload);

        expect(billing instanceof Error).toBe(true);
        expect(billing.message).toBe(errors.typeErrors.billingId.message);
    });

    test('tokenRefundStatus property must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.tokenRefundStatus = true;

        const billing = createBillingObj(payload);

        expect(billing instanceof Error).toBe(true);
        expect(billing.message).toBe(errors.typeErrors.tokenRefundStatus.message);
    });

    test('creationDate property must be date if exist', () => {
        let payload = copyObj(dummyData);
        payload.creationDate = 'weird odd text';

        const billing = createBillingObj(payload);

        expect(billing instanceof Error).toBe(true);
        expect(billing.message).toBe(errors.typeErrors.creationDate.message);
    });

    test('lastModified property must be date if exist', () => {
        let payload = copyObj(dummyData);
        payload.lastModified = 'weird odd text';

        const billing = createBillingObj(payload);

        expect(billing instanceof Error).toBe(true);
        expect(billing.message).toBe(errors.typeErrors.lastModified.message);
    });
});