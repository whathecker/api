const subscriptionDB = require('../../../../../../../../infra/data-access/subscription-db');
const serverStarter = require('../../../../../../serverStarter');
const session = require('supertest-session');
const { sub } = require('../../../../../../../_shared/messageQueueHelper/connection');
serverStarter.loadMiddlewares();
let testSession = session(serverStarter.app);

let payload = {
    country: "NL",
    channel: "EU",
    deliveryFrequency: 28,
    deliveryDay: 4,
    isWelcomeEmailSent: true,
    orders: ["order_num_1", "order_num_2"],
    isActive: true,
    deliverySchedules: [{
        orderNumber: "ECNL8092517600",
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
}
describe('Test subscription endpoint', () => {

    afterEach(async () => {
        await subscriptionDB.dropAll();
    });

    afterAll(async () => {
        await subscriptionDB.dropAll();
    });

    test('listSubscriptions success', () => {
        return testSession.get('/subscriptions')
        .then(response => {
            expect(response.status).toBe(200);
        });
    });

    test('getSubscriptionById fail - unknonw id', () => {
        return testSession.get('/subscriptions/subscription/oddid')
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('getSubscriptionById success', async () => {
        const subscription = await subscriptionDB.addSubscription(payload);
        const id = subscription.subscriptionId;
        return testSession.get(`/subscriptions/subscription/${id}`)
        .then(response => {
            expect(response.status).toBe(200);
        });
    });
});