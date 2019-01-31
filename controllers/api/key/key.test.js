const request = require('supertest'),
    app = require('../../../app'),
    mongoose = require('mongoose'),
    testCredential = require('../../../config/test/usercredential');


describe('test apikey apis', () => {
    
    beforeAll(() => {
        console.log('Jest start testing apikey endpoints');
    });

    afterAll(async () => {
        await app.close();
    });

    test('Test creating key will success', () => {
        return request(app).post('/auth/key')
            .set('X-API-Key', testCredential.apikey)
            .send({
                name: "testing"
            })
            .then((response) => {
                expect(response.status).toBe(201);
            });
    });

    test('Test creating key will fail as param is missing', () => {
        return request(app).post('/auth/key')
            .set('X-API-Key', testCredential.apikey)
            .send({
                name: null
            })
            .then((response) => {
                expect(response.status).toBe(400);
            });
    });

    test('Test deleting key will success', () => {
        return request(app).delete('/auth/key')
            .set('X-API-Key', testCredential.apikey)
            .send({
                name: "testing"
            })
            .then((response) => {
                expect(response.status).toBe(200);
            });
    });

    test('Test deleting key will fail as param is missing', () => {
        return request(app).delete('/auth/key')
            .set('X-API-Key', testCredential.apikey)
            .send({
                name: null
            })
            .then((response) => {
                expect(response.status).toBe(400);
            });
    });
})

