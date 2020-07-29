const serverStarter = require('../../../../../serverStarter');
const session = require('supertest-session');
serverStarter.loadMiddlewares();
let testSession = session(serverStarter.app);

describe('Test emailValidator plugin', () => {

    test('emailValidation fail - bad request', () => {
        return testSession.post('/validation/email')
        .send({})
        .then(response => {
            expect(response.status).toBe(400);
        });
    });

});