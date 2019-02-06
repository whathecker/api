const request = require('supertest'),
    app = require('../../../app'),
    testData = require('../../../config/test/subscriptionBox');


let createdBox = null;

describe('test package apis', () => {
    beforeAll(() => {
        console.log('Jest start testing package endpoints');
    });

    afterAll(() => {
        console.log('Jest finish testing product endpoints');
    });

    test('Test package creation will success', () => {
        return request(app).post('/subscriptionBox')
        .set('X-API-Key', testData.apikey)
        .send(testData.success)
        .then((response) => {
            createdBox = response.body;
            console.log(createdBox);
            expect(response.status).toBe(201);
        });
    });

    test('Test package creation will fail as invalid param is used', () => {
        return request(app).post('/subscriptionBox')
        .set('X-API-Key', testData.apikey)
        .send(testData.failInvalidParam)
        .then((response) => {
            expect(response.status).toBe(400);
        });
    });

    test('Test package delete request will success', () => {
        return request(app).delete(`/subscriptionBox/${createdBox.id}`)
            .set('X-API-Key', testData.apikey)
            .then((response) => {
                expect(response.status).toBe(200);
            });
    });
});