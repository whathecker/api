const app = require('../../../../app');
const request = require('supertest');
const session = require('supertest-session');
const testHelpers = require('../../../../utils/test/testHelpers');

let apikey = null;
let testSession = null;

describe('Test admin brand endpoints', () => {
    testSession = session(app);

    beforeAll(() => {
        return Promise.all([
            testHelpers.createTestApikey(),
            testHelpers.createTestAdminUser()
        ])
        .then(values => {
            //console.log(values);
            apikey = values[0];
            email = testHelpers.dummyAdminUserDetail.email;
            password = testHelpers.dummyAdminUserDetail.password;

            return testSession.post('/admin/users/user/login')
            .set('X-API-Key', apikey)
            .send({
                email: email,
                password: password
            })
            .then(response => {
                expect(response.status).toBe(200);
            });

        });
        
    })

    afterAll(() => {
        return Promise.all([
            testHelpers.removeTestAdminUsers(),
            testHelpers.removeTestApikeys(),
            testHelpers.removeTestBrands()
        ]);
    });

    test('getBrands success - length is 0', () => {
        return testSession.get('/admin/brands/')
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.brands.length).toBe(0);
        });
    });

    test('createBrand fail - bad request', () => {
        return testSession.post('/admin/brands/brand')
        .set('X-API-Key', apikey)
        .send({})
        .then(response => {
            expect(response.status).toBe(400);
        });
    });

    test('createBrand success', () => {
        return testSession.post('/admin/brands/brand')
        .set('X-API-Key', apikey)
        .send({ 
            brandName: 'missha', 
            brandCode: 'MA' 
        })
        .then(response => {
            expect(response.status).toBe(201);
        });
    });

    test('getBrands success - length is 1', () => {
        return testSession.get('/admin/brands/')
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.brands.length).toBe(1);
        });
    });
    
    test('createBrand fail - duplicated params', () => {
        return testSession.post('/admin/brands/brand')
        .set('X-API-Key', apikey)
        .send({ 
            brandName: 'missha', 
            brandCode: 'MA' 
        })
        .then(response => {
            expect(response.status).not.toBe(201);
        });
    });

    test('createBrand success', () => {
        return testSession.post('/admin/brands/brand')
        .set('X-API-Key', apikey)
        .send({ 
            brandName: 'holika holika', 
            brandCode: 'HO' 
        })
        .then(response => {
            expect(response.status).toBe(201);
        });
    });

    test('createBrand success', () => {
        return testSession.post('/admin/brands/brand')
        .set('X-API-Key', apikey)
        .send({ 
            brandName: 'klaries', 
            brandCode: 'KL' 
        })
        .then(response => {
            expect(response.status).toBe(201);
        });
    });
   
    test('getBrands success - length is 3', () => {
        return testSession.get('/admin/brands/')
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.brands.length).toBe(3)
        });
    });

});