const serverStarter = require('../../../../../serverStarter');
const session = require('supertest-session');
serverStarter.loadMiddlewares();
let testSession = session(serverStarter.app);

describe('Test payment plugin', () => {

    test('createPaymentSession fail - bad request', () => {
        return testSession.post('/payment/session')
        .send({})
        .then(response => {
            expect(response.status).toBe(400);
        });
    });

    test('getPaymentMethods success', () => {
        return testSession.post('/payment/methods')
        .send()
        .then(response => {
            expect(response.status).toBe(200);
        });
    });
});