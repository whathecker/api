const subscriptionDB = require('../index');
let mockSubscriptions = require('./_mock');

describe('Test database access layer of subscription object', () => {

    const _subscriptionId_holder = {
        0: null,
        1: null
    };

    beforeEach(async () => {
        await subscriptionDB.dropAll();

        const subscription = await subscriptionDB.addSubscription(mockSubscriptions[0]);
        const subscription2 = await subscriptionDB.addSubscription(mockSubscriptions[1]);

        _subscriptionId_holder[0] = subscription.subscriptionId;
        _subscriptionId_holder[1] = subscription2.subscriptionId;
    });

    afterAll(async () => {
        await subscriptionDB.dropAll();
    });

    test('list all subscriptions', async () => {
        const subscriptions = await subscriptionDB.listSubscriptions();
        expect(subscriptions).toHaveLength(2);
    });

    test('find subscription by subscriptionId', async () => {
        const id = _subscriptionId_holder[0];

        const subscription = await subscriptionDB.findSubscriptionBySubscriptionId(id);
        const {_id, subscriptionId, endDate, ...rest} = subscription;

        expect(rest).toEqual(mockSubscriptions[0]);
    });

    test('find subscription by userId', async () => {
        const user_id = "2";

        const subscriptions = await subscriptionDB.findSubscriptionByUserId(user_id);
        const {_id, subscriptionId, endDate, ...rest} = subscriptions[0];

        expect(subscriptions).toHaveLength(1);
        expect(rest).toEqual(mockSubscriptions[0]);
    });

    test('add a new subscription', async () => {
        const payload = {
            country: "NL",
            channel: "EU",
            deliveryFrequency: 28,
            deliveryDay: 4,
            isWelcomeEmailSent: true,
            orders: ["order_num_1", "order_num_2"],
            isActive: true,
            deliverySchedules: [{
                orderNumber: "ECNL8092517100",
                nextDeliveryDate: new Date('December 17, 1995 03:24:00'),
                year: 1995,
                month: 11,
                date: 17,
                day: 0,
            }],
            subscribedItems: [
                {
                    itemId: "PKOL90587",
                    quantity: 1
                },
            ],
            user_id: "2",
            paymentMethod_id: "2",
            creationDate: new Date('December 14, 1995 03:24:00'),
            lastModified: new Date('December 24, 1995 03:24:00'),
        };

        const newSubscription = await subscriptionDB.addSubscription(payload);
        const {_id, subscriptionId, endDate, ...rest} = newSubscription;

        expect(rest).toEqual(payload);
    });

    test('updateSubscriptionStatus fail - cannot update to same status, from active to active', async () => {
        const subscriptionId = _subscriptionId_holder[0];
        const updatedStatusFlag = true;
        await expect(subscriptionDB.updateSubscriptionStatus(subscriptionId, updatedStatusFlag)).rejects.toMatchObject({
            status: "fail",
            reason: "error"
        });
    });

    test('updateSubscriptionStatus fail - cannot update to same status, from inactive to inactive', async () => {
        const payload = {
            country: "NL",
            channel: "EU",
            deliveryFrequency: 28,
            deliveryDay: 4,
            isWelcomeEmailSent: true,
            orders: ["order_num_1", "order_num_2"],
            isActive: false,
            deliverySchedules: [{
                orderNumber: "ECNL8092517100",
                nextDeliveryDate: new Date('December 17, 1995 03:24:00'),
                year: 1995,
                month: 11,
                date: 17,
                day: 0,
            }],
            subscribedItems: [
                {
                    itemId: "PKOL90587",
                    quantity: 1
                },
            ],
            user_id: "2",
            paymentMethod_id: "2",
            creationDate: new Date('December 14, 1995 03:24:00'),
            lastModified: new Date('December 24, 1995 03:24:00'),
        };

        const newSubscription = await subscriptionDB.addSubscription(payload);
        const { subscriptionId } = newSubscription;
        const updatedStatusFlag = false;
        await expect(subscriptionDB.updateSubscriptionStatus(subscriptionId, updatedStatusFlag)).rejects.toMatchObject({
            status: "fail",
            reason: "error"
        });
    });

    test('updateSubscriptionStatus - inactivate subscription', async () => {
        const subscriptionId = _subscriptionId_holder[0];
        const updatedStatusFlag = false;

        const updatedSubscription = await subscriptionDB.updateSubscriptionStatus(subscriptionId, updatedStatusFlag);

        const { isActive } = updatedSubscription;

        expect(isActive).toBe(false);
    });

    test('updateSubscriptionStatus - activate subscription', async () => {
        const payload = {
            country: "NL",
            channel: "EU",
            deliveryFrequency: 28,
            deliveryDay: 4,
            isWelcomeEmailSent: true,
            orders: [],
            isActive: false,
            deliverySchedules: [],
            subscribedItems: [
                {
                    itemId: "PKOL90587",
                    quantity: 1
                },
            ],
            user_id: "2",
            paymentMethod_id: "2",
            creationDate: new Date('December 14, 1995 03:24:00'),
            lastModified: new Date('December 24, 1995 03:24:00'),
        };

        const newSubscription = await subscriptionDB.addSubscription(payload);
        const { subscriptionId } = newSubscription;
        const updatedStatusFlag = true;

        const updatedSubscription = await subscriptionDB.updateSubscriptionStatus(subscriptionId, updatedStatusFlag);

        const { isActive, deliverySchedules } = updatedSubscription;

        expect(isActive).toBe(true);
        expect(deliverySchedules).toHaveLength(1);
    });

    test('delete a subscription by subscriptionId', async () => {
        const subscriptionId = _subscriptionId_holder[1];

        const result = await subscriptionDB.deleteSubscriptionBySubscriptionId(subscriptionId);
        const subscriptions = await subscriptionDB.listSubscriptions();

        expect(result.status).toBe('success');
        expect(result.subscriptionId).toEqual(subscriptionId);
        expect(subscriptions).toHaveLength(1);
    });

    test('drop all subscriptions in db', async () => {
        await subscriptionDB.dropAll();
        const subscriptions = await subscriptionDB.listSubscriptions();

        expect(subscriptions).toHaveLength(0);
    });
});