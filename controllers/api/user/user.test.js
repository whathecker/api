const request = require('supertest'),
    app = require('../../../app'),
    mongoose = require('mongoose'),
    testCredentical = require('../../../config/test/usercredential');


describe('test user apis', () => {

    beforeAll(() => {
        console.log('Jest start testing user endpoints');
    });
    
    afterAll( async () => {
        await app.close();
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

    test('Test sign-up will fail as email already exist', () => {
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

    test('Test sign-up will fail as email addrss format is invalid', () => {
        return request(app).post('/user')
            .set('X-API-Key', testCredentical.apikey)
            .send({
                email: testCredentical.fail.invalidEmail,
                password: testCredentical.fail.password,
                firstname: testCredentical.fail.firstname,
                lastname: testCredentical.fail.lastname
            })
            .then((response) => {
                expect(response.status).toBe(500);
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