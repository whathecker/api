const request = require('supertest');
const app = require('../../../app');
const mongoose = require('mongoose');
//const connector = require('../../../utils/connector');


const testCredentical = {
    apikey: '486917e2aaa613d0ed04628a57d25d32',
    success: {
        email: "yunjae.oh.nl@gmail.com",
        password: "password1",
        firstname: "yunjae",
        lastname: "oh"
    },
    fail : {
        email: "yunjae.oh.nl1@gmail.com",
        password: "passwordsdgsdge"
    }
}

describe('test user apis', () => {

    beforeAll(() => {
        console.log('Jest start testing');
    });
    
    afterAll(() => {
        return mongoose.disconnect();
    });
    
    // testing will create actual account in database with testing credential
    test('Test sign-up will success', () => {
        return request(app).post('/user')
            .set('X-API-Key', testCredentical.apikey)
            .send({ 
                email: testCredentical.success.email,
                password: testCredentical.success.password,
                firstname: testCredentical.success.firstname,
                lastname: testCredentical.success.lastname
            })
            .then((response) => {
                expect(response.status).toBe(201);
            });
    });

    test('Test sign-up will fail with 202', () => {
        return request(app).post('/user')
            .set('X-API-Key', testCredentical.apikey)
            .send({
                email: testCredentical.success.email,
                password: testCredentical.success.password,
                firstname: testCredentical.success.firstname,
                lastname: testCredentical.success.lastname
            })
            .then((response) => {
                expect(response.status).toBe(202);
            });
    });

    test('Test sign-in will success', () => {
        return request(app).post('/user/login')
            .set('X-API-Key', testCredentical.apikey)
            .send({
                email: testCredentical.success.email,
                password: testCredentical.success.password
            })
            .then((response) => {
                expect(response.status).toBe(200);
            });
    });

    test('Test sign-in will fail', () => {
        return request(app).post('/user/login')
            .set('X-API-Key', testCredentical.apikey)
            .send({
                email: testCredentical.success.email,
                password: testCredentical.fail.password
            })
            .then((response) => {
                expect(response.status).toBe(401);
            });
    });

    //test sign-out 

    //test delete user
    
    test('Test user will be deleted', () => {
        return request(app).delete('/user')
            .set('X-API-Key', testCredentical.apikey)
            .send({
                email: testCredentical.success.email
            })
            .then((response) => {
                expect(response.status).toBe(200);
            });
    });

    test('Test delete user will fail with 204 ', () => {
        return request(app).delete('/user')
            .set('X-API-Key', testCredentical.apikey)
            .send({
                email: testCredentical.fail.email
            })
            .then((response) => {
                expect(response.status).toBe(204);
            });
    });

    test('Test delete user will fail with 400', () => {
        return request(app).delete('/user')
            .set('X-API-Key', testCredentical.apikey)
            .send({
                firstname: testCredentical.success.firstname
            })
            .then((response) => {
                expect(response.status).toBe(400);
            });
    });
});