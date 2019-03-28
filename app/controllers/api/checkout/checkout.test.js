const request = require('supertest'),
    app = require('../../../app'),
    testCredentical = require('../../../config/test/usercredential');


describe('test checkout apis', () =>{

    test('/checkout/email return 200', () => {
        return request(app).post('/checkout/email')
            .set('X-API-Key', testCredentical.apikey)
            .send({
                email: 'yunjae@gmail.com'
            })
            .then((response) => {
                expect(response.status).toBe(200);
            })
    });

    test('/checkout/email return 204', () => {
        return request(app).post('/checkout/email')
            .set('X-API-Key', testCredentical.apikey)
            .send({
                email: 'some non existing email'
            })
            .then((response) => {
                expect(response.status).toBe(204);
            })
    });

    test('/checkout/email return 400 as email param is missing', () => {
        return request(app).post('/checkout/email')
            .set('X-API-Key', testCredentical.apikey)
            .then((response) => {
                expect(response.status).toBe(400);
            })
    });
})