const request = require('supertest');
const app = require('../../../../app');
const testHelpers = require('../../../../utils/test/testHelpers');

let apikey = null;

describe('Test adminUser endpoints,', () => {

    beforeAll(() => {
        return testHelpers.createTestApikey()
        .then((key) => {
            apikey = key;
            return;
        });    
    });
    
    afterAll(() => {
        return Promise.all([
            testHelpers.removeTestAdminUsers(),
            testHelpers.removeTestApikeys()
        ]);
    });
    
    test('createAdminUser fail - invalid email domain', () => {
        return request(app).post('/admin/users/user')
        .set('X-API-Key', apikey)
        .send({
            email: 'yunjae.oh.nl@gmail.com',
            password: 'thisistestpassword'
        })
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.result).toBe('invalid_email');
        });
    });

    test('createAdminUser fail - bad request', () => {
        return request(app).post('/admin/users/user')
        .set('X-API-Key', apikey)
        .send({})
        .then(response => {
            expect(response.status).toBe(400)
        });
    });

    test('createAdminUser success', () => {
        return request(app).post('/admin/users/user')
        .set('X-API-Key', apikey)
        .send({
            email: 'yunjae.oh@hellochokchok.com',
            password: 'thisistestpassword'
        })
        .then(response => {
            expect(response.status).toBe(201);
        });
    });

    test('createAdminUser fail - duplicated email', () => {
        return request(app).post('/admin/users/user')
        .set('X-API-Key', apikey)
        .send({
            email: 'yunjae.oh@hellochokchok.com',
            password: 'thisistestpassword'
        })
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.result).toBe('duplicated_email');
        });
    });

    test('loginAdminUser fail - wrong credential', () => {
        return request(app).post('/admin/users/user/login')
        .set('X-API-Key', apikey)
        .send({
            email: 'yunjae.oh@hellochokchok.com',
            password: 'thisistestpasswordss'
        })
        .then(response => {
            expect(response.status).toBe(401);
        });
    });

    test('loginAdminUser success',  () => {
        return request(app).post('/admin/users/user/login')
        .set('X-API-Key', apikey)
        .send({
            email: 'yunjae.oh@hellochokchok.com',
            password: 'thisistestpassword'
        })
        .then(response => {
            expect(response.status).toBe(200);
        });
    });

});