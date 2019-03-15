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

    test('Test package creation will fail as wrong box type is used', () => {
        return request(app).post('/subscriptionBox')
        .set('X-API-Key', testData.apikey)
        .send(testData.failWrongBoxType)
        .then((response) => {
            expect(response.status).toBe(500);
        });
    });
    test('Test package creation will fail as box type is missed', () => {
        return request(app).post('/subscriptionBox')
        .set('X-API-Key', testData.apikey)
        .send(testData.failMissBoxType)
        .then((response) => {
            expect(response.status).toBe(400);
        });
    });
    test('Test package creation will fail as box name is missed', () => {
        return request(app).post('/subscriptionBox')
        .set('X-API-Key', testData.apikey)
        .send(testData.failMissBoxName)
        .then((response) => {
            expect(response.status).toBe(400);
        });
    });
    test('Test package creation will fail due to invalid price data', () => {
        return request(app).post('/subscriptionBox')
        .set('X-API-Key', testData.apikey)
        .send(testData.failInvalidPriceData)
        .then((response) => {
            expect(response.status).toBe(422);
        });
    });

    test('Test package delete request will failed as param is invalid', () => {
        return request(app).delete(`/subscriptionBox/someinvalidparam`)
            .set('X-API-Key', testData.apikey)
            .then((response) => {
                expect(response.status).toBe(204);
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