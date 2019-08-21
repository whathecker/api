const app = require('../../../../app');
const session = require('supertest-session');
const testHelpers = require('../../../../utils/test/testHelpers');

let apikey = null;
let testSession = null;

describe('Test admin cateogery endpoints',  () => {
    testSession = session(app);

    beforeAll(() => {

        return Promise.all([
            testHelpers.createTestApikey(),
            testHelpers.createTestAdminUser()
        ])
        .then(values => {
            apikey = values[0];
            email = values[1].email;
            password = process.env.TEST_ADMIN_USER_PASSWORD;

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

    });

    afterAll(() => {
        return Promise.all([
            testHelpers.removeTestAdminUsers(),
            testHelpers.removeTestApikeys(),
            testHelpers.removeTestCategories()
        ]);
    });

    test('getCategories success - length is 0', () => {
        return testSession.get('/admin/categories/')
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.categories.length).toBe(0);
        });
    });

    test('createCategory fail - bad request', () => {
        return testSession.post('/admin/categories/category')
        .set('X-API-Key', apikey)
        .send({})
        .then(response => {
            expect(response.status).toBe(400);
        });
    });

    test('createCategory fail - wrong param type', () => {
        return testSession.post('/admin/categories/category')
        .set('X-API-Key', apikey)
        .send({
            categoryName: 'sheetmask',
            categoryCode: 0
        })
        .then(response => {
            expect(response.status).not.toBe(201);
        });
    });

    test('createCategory success', () => {
        return testSession.post('/admin/categories/category')
        .set('X-API-Key', apikey)
        .send({
            categoryName: 'sheetmask',
            categoryCode: 'st'
        })
        .then(response => {
            expect(response.status).toBe(201);
        });
    });

    test('getCategories success - length is 1', () => {
        return testSession.get('/admin/categories/')
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.categories.length).toBe(1);
        });
    });

    test('createCategory fail - duplicated params', () => {
        return testSession.post('/admin/categories/category')
        .set('X-API-Key', apikey)
        .send({
            categoryName: 'sheetmask',
            categoryCode: 'st'
        })
        .then(response => {
            expect(response.status).not.toBe(201);
        });
    });

    test('createCategory success', () => {
        return testSession.post('/admin/categories/category')
        .set('X-API-Key', apikey)
        .send({
            categoryName: 'cream',
            categoryCode: 'CR'
        })
        .then(response => {
            expect(response.status).toBe(201);
        });
    });

    test('createCategory success', () => {
        return testSession.post('/admin/categories/category')
        .set('X-API-Key', apikey)
        .send({
            categoryName: 'test',
            categoryCode: 'TE'
        })
        .then(response => {
            expect(response.status).toBe(201);
        });
    });

    test('getCategories success - length is 3', () => {
        return testSession.get('/admin/categories/')
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.categories.length).toBe(3);
        });
    });

});