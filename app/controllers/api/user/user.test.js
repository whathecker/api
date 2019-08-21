const request = require('supertest');
const session = require('supertest-session');
const app = require('../../../app');
const testCredentical = require('../../../config/test/usercredential');


describe('test user apis', () => {

    let testSession = null;

    beforeAll(() => {
        console.log('Jest start testing user endpoints');
        testSession = session(app);
    });
    
    afterAll( async () => {
        //await app.close();
    });
    
    // testing will create actual account in database with testing credential
    test('Test sign-up will success', () => {
        return testSession.post('/user')
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
        return testSession.post('/user')
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
        return testSession.post('/user')
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
        return testSession.post('/user/login')
            .set('X-API-Key', testCredentical.apikey)
            .send({
                email: testCredentical.success.email,
                password: testCredentical.success.password
            }, { withCredentials: true })
            .then((response) => {
                expect(response.status).toBe(200);
            });
    });

    test('Test sign-out will successful', () => {
        return testSession.get('/user/logout')
            .set('X-API-Key', testCredentical.apikey)
            .then((response) => {
                expect(response.status).toBe(200);
            });
    });

    test('Test sign-in will fail', () => {
        return testSession.post('/user/login')
            .set('X-API-Key', testCredentical.apikey)
            .send({
                email: testCredentical.success.email,
                password: testCredentical.fail.password
            })
            .then((response) => {
                expect(response.status).toBe(400);
            });
    });

    test('Test sign-out will fail with 401', () => {
        return testSession.get('/user/logout')
            .set('X-API-Key', testCredentical.apikey)
            .then((response) => {
                expect(response.status).toBe(401);
            });
    });


    //test delete user    
    test('Test user will be deleted', () => {
        return testSession.delete('/user')
            .set('X-API-Key', testCredentical.apikey)
            .send({
                email: testCredentical.success.email
            })
            .then((response) => {
                expect(response.status).toBe(200);
            });
    });

    test('Test delete user will fail with 204 ', () => {
        return testSession.delete('/user')
            .set('X-API-Key', testCredentical.apikey)
            .send({
                email: testCredentical.fail.email
            })
            .then((response) => {
                expect(response.status).toBe(204);
            });
    });

    test('Test delete user will fail with 400', () => {
        return testSession.delete('/user')
            .set('X-API-Key', testCredentical.apikey)
            .send({
                firstname: testCredentical.success.firstname
            })
            .then((response) => {
                expect(response.status).toBe(400);
            });
    });
});