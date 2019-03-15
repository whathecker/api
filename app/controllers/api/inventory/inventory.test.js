const request = require('supertest'),
    app = require('../../../app'),
    testData = require('../../../config/test/inventory');

let createdProduct;

describe('test inventory apis', () => {
    beforeAll(() => {
        console.log('Jest start testing inventory endpoints');
    });
    afterAll(() => {
        console.log('Jest finish testing product endpoints');
    });

    test('Test product creation will success', () => {
        return request(app).post('/products')
        .set('X-API-Key', testData.apikey)
        .send(testData.createProductSuccess)
        .then((response) => {
            createdProduct = response.body;
            expect(response.status).toBe(201);
        });
    });

    test('Test inventory creation will success', () => {
        return request(app).post(`/inventory/${createdProduct.id}`)
        .set('X-API-Key', testData.apikey)
        .send(testData.createInventorySuccess)
        .then((response) => {
            expect(response.status).toBe(201);
        });
    });

    test('Test inventory creation will fail as qty param is not number', () => {
        return request(app).post(`/inventory/${createdProduct.id}`)
        .set('X-API-Key', testData.apikey)
        .send(testData.createInventoryFailWrongNum)
        .then((response) => {
            expect(response.status).toBe(400);
        });
    });

    test('Test inventory creation will fail as productId param is invalid', () => {
        return request(app).post(`/inventory/invalidparam`)
        .set('X-API-Key', testData.apikey)
        .send(testData.createInventorySuccess)
        .then((response) => {
            expect(response.status).toBe(404);
        });
    });

    test('Test inventory update will success', () => {
        return request(app).put(`/inventory/${createdProduct.id}`)
        .set('X-API-Key', testData.apikey)
        .send(testData.updateInventorySuccess)
        .then((response) => {
            expect(response.status).toBe(200);
        });
    });

    test('Test inventory update will fail as qty param is missng', () => {
        return request(app).put(`/inventory/${createdProduct.id}`)
        .set('X-API-Key', testData.apikey)
        .send(testData.updateInventoryFailNoQTY)
        .then((response) => {
            expect(response.status).toBe(400);
        });
    }); 

    test('Test inventory update will fail as qty param is NaN', () => {
        return request(app).put(`/inventory/${createdProduct.id}`)
        .set('X-API-Key', testData.apikey)
        .send(testData.updateInventoryFailNotNum)
        .then((response) => {
            expect(response.status).toBe(400);
        });
    });

    test('Test get inventory will success', () => {
        return request(app).get(`/inventory/${createdProduct.id}`)
        .set('X-API-Key', testData.apikey)
        .then((response) => {
            expect(response.body.quantity).toBe(100);
        });
    });

    test('Test get inventory will fail as param is invalid', () => {
        return request(app).get(`/inventory/invalidParam`)
        .set('X-API-Key', testData.apikey)
        .then((response) => {
            expect(response.status).toBe(404);
        });
    });

    test('Test delete inventory will fail as param is invalid', () => {
        return request(app).delete(`/inventory/InvalidParam`)
        .set('X-API-Key', testData.apikey)
        .then((response) => {
            expect(response.status).toBe(404);
        });
    });

    test('Test delete inventory will success', () => {
        return request(app).delete(`/inventory/${createdProduct.id}`)
        .set('X-API-Key', testData.apikey)
        .then((response) => {
            expect(response.status).toBe(200);
        });
    });

    test('Test product delete will success', () => {
        return request(app).delete(`/products/${createdProduct.id}`)
        .set('X-API-Key', testData.apikey)
        .then((response) => {
            expect(response.status).toBe(200);
        });
    });

})