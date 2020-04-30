const billingDB = require('../index');
let mockBillings = require('./_mock');

describe('Test database access layer of billing object', () => {

    const _billingId_holder = {
        0: null,
        1: null,
        2: null
    };

    beforeEach(async () => {
        await billingDB.dropAll();

        const billing = await billingDB.addBilling(mockBillings[0]);
        const billing2 = await billingDB.addBilling(mockBillings[1]);
        const billing3 = await billingDB.addBilling(mockBillings[2]);

        _billingId_holder[0] = billing.billingId;
        _billingId_holder[1] = billing2.billingId;
        _billingId_holder[2] = billing3.billingId;
    });

    afterAll(async () => {
        await billingDB.dropAll();
    });

    test('list a billing options', async () => {
        const billings = await billingDB.listBillings();
        expect(billings).toHaveLength(3);
    });

    test('find a billing option by billingId', async () => {
        const id = _billingId_holder[0];

        const billing = await billingDB.findBillingByBillingId(id);
        const {_id, ...rest} = billing;

        expect(rest).toEqual(mockBillings[0]);
    });

    test('add a new billing option', async () => {
        const payload = {
            user_id: "2",
            type: "visa",
            billingId: "pm_12378",
            tokenRefundStatus: "NOT_REQUIRED",
            creationDate: new Date('December 17, 1997 03:24:00'),
            lastModified: new Date('December 17, 1999 03:24:00')
        };

        const newBilling = await billingDB.addBilling(payload);
        const {_id, ...rest} = newBilling;

        expect(rest).toEqual(payload);
    });

    test('delete a billing option by billingId', async () => {
        const billingId = _billingId_holder[2];

        const result = await billingDB.deleteBillingByBillingId(billingId);
        const billings = await billingDB.listBillings();

        expect(result.status).toBe('success');
        expect(result.billingId).toEqual(billingId);
        expect(billings).toHaveLength(2);
    });

    test('drop all billing options in db', async () => {
        await billingDB.dropAll();
        const billings = await billingDB.listBillings();

        expect(billings).toHaveLength(0);
    });
});