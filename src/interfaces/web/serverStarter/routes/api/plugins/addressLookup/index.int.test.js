const serverStarter = require('../../../../../serverStarter');
const session = require('supertest-session');
serverStarter.loadMiddlewares();
let testSession = session(serverStarter.app);

describe('Test addressLookup plug-in', () => {

    test('addressLookup fail - bad request', () => {
        return testSession.post('/lookup/address')
        .send({})
        .then(response => {
            expect(response.status).toBe(400);
        });
    });

    test('addressLookup fail - invalid countryCode', () => {
        return testSession.post('/lookup/address')
        .send({
            countryCode: "invalid",
            address: {}
        })
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('addressLookup: NL fail - missing postalCode or houseNumber in payload', () => {
        return testSession.post('/lookup/address')
        .send({
            countryCode: "NL",
            address: {
                postalCode: "1034WK"
            }
        })
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

});