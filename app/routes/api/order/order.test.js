const app = require('../../../app');
const session = require('supertest-session');
const testHelpers = require('../../../utils/test/testHelpers');

let apikey = null;

describe('Test order endpoints', () => {
    const testSession = session(app);

    beforeAll(() => {
        
        return Promise.all([
            testHelpers.createTestApikey(),
            testHelpers.createTestAdminUser(),
            testHelpers.createTestProducts(),
            // create products
            // create packages
            // create subscribed user

        ])
        .then(values => {
            apikey = values[0],
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
            testHelpers.removeTestProducts()
        ]);
    });


});