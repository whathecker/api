const request = require('supertest');
const app = require('../../../app');
const mongoose = require('mongoose');
const connector = require('../../../utils/connector');


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
        return mongoose.connect(connector.getDBString());
    });
    
    afterAll(() => {
        return mongoose.disconnect();
    });
    
    // testing will create actual account in database with testing credential
    test('Test sign-up will success', () => {
        return request(app).post('/api/user')
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

    test('Test sign-in will success', () => {
        return request(app).post('/api/user/login')
            .set('X-API-Key', testCredentical.apikey)
            .send({
                email: testCredentical.success.email,
                password: testCredentical.success.password
            })
            .then((response) => {
                expect(response.status).toBe(200);
            });
    });

    //test sign-out 

    //test delete user
});