const packageDB = require('../../../../../../../infra/data-access/subscriptionBox-db');
const serverStarter = require('../../../../../starter');
const session = require('supertest-session');
serverStarter.loadMiddlewares();
let testSession = session(serverStarter.app);

describe('Test subscriptionBoxes endpoint', () => {
    
    afterEach(async () => {
        await packageDB.dropAll();
    });

    afterAll(async () => {
        await packageDB.dropAll();
    });

    test('listSubscriptionBoxes success', () => {
        return testSession.get('/subscriptionBoxes')
        .then(response => {
            expect(response.status).toBe(200);
        });
    });
});