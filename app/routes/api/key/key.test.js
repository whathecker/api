const request = require('supertest');
const app = require('../../../app');
const testHelpers = require('../../../utils/test/testHelpers');

let apikey = null;
let createdApikey = null;

describe('Test apikey endpoints', () => {
    beforeAll(() => {
        return testHelpers.createTestApikey()
        .then(key => {
            apikey = key;
            return
        });
    });

    afterAll(() => {
        return testHelpers.removeTestApikeys();
    });

    test('createApikey fail - bad request', () => {
        return request(app).post('/auth/key')
        .set('X-API-Key', apikey)
        .send({})
        .then(response => {
            expect(response.status).toBe(400);
        });
    });

    test('createApikey success', () => {
        return request(app).post('/auth/key')
        .set('X-API-Key', apikey)
        .send({ name: 'test key' })
        .then(response => {
            createdApikey = response.body.key;
            expect(response.status).toBe(201);
        });
    });

    test('deleteApikey fail - unknown key_id', () => {
        return request(app).delete(`/auth/key/invalid`)
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).not.toBe(422);
            expect(response.status).not.toBe(200);
        });
    });

    test('deleteApikey success', () => {
        return request(app).delete(`/auth/key/${createdApikey._id}`)
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(200);
        });
    })

});