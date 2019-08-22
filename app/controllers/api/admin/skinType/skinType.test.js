const app = require('../../../../app');
const session = require('supertest-session');
const testHelpers = require('../../../../utils/test/testHelpers');

let apikey = null;
let testSession = null;

describe('Test admin skintype endpoints', () => {
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
            testHelpers.removeTestSkinTypes()
        ]);
    });

    test('getSkinTypes success - length is 0', () => {
        return testSession.get('/admin/skintypes/')
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.skinTypes.length).toBe(0);
        });
    });

    test('createSkinType fail - bad request', () => {
        return testSession.post('/admin/skintypes/skintype')
        .set('X-API-Key', apikey)
        .send({})
        .then(response => {
            expect(response.status).toBe(400);
        });
    });

    test('createSkinType fail - wrong param type', () => {
        return testSession.post('/admin/skintypes/skintype')
        .set('X-API-Key', apikey)
        .send({
            skinType: true
        })
        .then(response => {
            expect(response.status).not.toBe(201);
        });
    });

    test('createSkinType fail - invalid param value', () => {
        return testSession.post('/admin/skintypes/skintype')
        .set('X-API-Key', apikey)
        .send({
            skinType: 'odd'
        })
        .then(response => {
            expect(response.status).not.toBe(201);
        });
    });

    test('createSkinType success', () => {
        return testSession.post('/admin/skintypes/skintype')
        .set('X-API-Key', apikey)
        .send({
            skinType: 'dry'
        })
        .then(response => {
            expect(response.status).toBe(201);
        });
    });

    test('getSkinTypes success - length is 1', () => {
        return testSession.get('/admin/skintypes/')
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.skinTypes.length).toBe(1);
        });
    });

    test('createSkinType fail - duplicated param', () => {
        return testSession.post('/admin/skintypes/skintype')
        .set('X-API-Key', apikey)
        .send({
            skinType: 'dry'
        })
        .then(response => {
            expect(response.status).not.toBe(201);
        });
    });

    test('createSkinType success', () => {
        return testSession.post('/admin/skintypes/skintype')
        .set('X-API-Key', apikey)
        .send({
            skinType: 'normal'
        })
        .then(response => {
            expect(response.status).toBe(201);
        });
    });

    test('createSkinType success', () => {
        return testSession.post('/admin/skintypes/skintype')
        .set('X-API-Key', apikey)
        .send({
            skinType: 'oily'
        })
        .then(response => {
            expect(response.status).toBe(201);
        });
    });

    test('getSkinTypes success - length is 3', () => {
        return testSession.get('/admin/skintypes/')
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.skinTypes.length).toBe(3);
        });
    });

    
});