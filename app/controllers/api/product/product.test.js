const request = require('supertest'),
    app = require('../../../app'),
    testData = require('../../../config/test/product');

let createdProduct;

describe('test product apis', () => {
    beforeAll(() => {
        console.log(`Jest start testing product endpoints`);
    });
    afterAll(() => {
        console.log('Jest finish testing product endpoints');
    });

    test('Test product creation will success', () => {
        return request(app).post('/product')
        .set('X-API-Key', testData.apikey)
        .send(testData.success)
        .then((response) => {
            createdProduct = response.body;
            expect(response.status).toBe(201);
        });
    });

    test('Test product creation will fail due to wrong category name', () => {
        return request(app).post('/product')
        .set('X-API-Key', testData.apikey)
        .send(testData.failWrongCategory)
        .then((response) => {
            expect(response.status).toBe(500);
        });
    });

    test('Test product creation will fail due to wrong brand name', () => {
        return request(app).post('/product')
        .set('X-API-Key', testData.apikey)
        .send(testData.failWrongBrand)
        .then((response) => {
            expect(response.status).toBe(500);
        });
    });

    test('Test product get will success', () => {
        return request(app).get(`/product/${createdProduct.id}`)
        .set('X-API-Key', testData.apikey)
        .then((response) => {
            expect(response.status).toBe(200);
        });
    });

    test('Test product get will fail as param is missing', () => {
        return request(app).get(`/product`)
        .set('X-API-Key', testData.apikey)
        .then((response) => {
            expect(response.status).toBe(404);
        });
    });

    
    test('Test product get will fail as param is unknown', () => {
        return request(app).get(`/product/id`)
        .set('X-API-Key', testData.apikey)
        .then((response) => {
            expect(response.status).toBe(204);
        });
    });

    test('Test product update will success', () => {
        return request(app).put(`/product/${createdProduct.id}`)
        .set('X-API-Key', testData.apikey)
        .send({
            update: {
                name: "this is new name"
            } 
        })
        .then((response) => {
            expect(response.status).toBe(200);
        });
    });

    test('Test product get will success with new detail', () => {
        return request(app).get(`/product/${createdProduct.id}`)
        .set('X-API-Key', testData.apikey)
        .then((response) => {
            expect(response.body.name).toBe("this is new name");
        });
    });

    test('Test product delete will fail as param is unknown', () => {
        return request(app).delete(`/product/fakeid`)
        .set('X-API-Key', testData.apikey)
        .then((response) => {
            expect(response.status).toBe(204);
        });
    });

    test('Test product delete will fail as param is missing', () => {
        return request(app).delete('/product')
        .set('X-API-Key', testData.apikey)
        .then((response) => {
            expect(response.status).toBe(404);
        });
    });

    test('Test product delete will success', () => {
        return request(app).delete(`/product/${createdProduct.id}`)
        .set('X-API-Key', testData.apikey)
        .then((response) => {
            expect(response.status).toBe(200);
        });
    });

});