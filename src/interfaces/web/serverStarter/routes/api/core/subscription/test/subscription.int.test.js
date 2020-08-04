const subscriptionDB = require('../../../../../../../../infra/data-access/subscription-db');
const serverStarter = require('../../../../../../serverStarter');
const session = require('supertest-session');
serverStarter.loadMiddlewares();
let testSession = session(serverStarter.app);

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
});