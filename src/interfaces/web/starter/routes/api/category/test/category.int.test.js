const serverStarter = require('../../../../../starter');
serverStarter.loadMiddlewares();
const app = serverStarter.app

const session = require('supertest-session');
let testSession =  session(app);

const categoryDB = require('../../../../../../../infra/data-access/category-db');

describe('Test admin category endpoints', () => {

    afterAll(async () => {
        await categoryDB.dropAll();
    });

    test('getCategories success', () => {
        return testSession.get('/admin/categories')
        .then(response => {
            expect(response.status).toBe(200);
        });
    });

    test('createCategory fail - bad request', () => {
        return testSession.post('/admin/categories/category')
        .send({})
        .then(response => {
            expect(response.status).toBe(400);
        });
    });

    test('createCategory success', () => {
        return testSession.post('/admin/categories/category')
        .send({
            categoryName: 'test',
            categoryCode: "TT"
        })
        .then(response => {
            expect(response.status).toBe(201);
        });
    });

    test('createCategory fail - duplicated code', async () => {
        const payload = {
            categoryName: 'test2',
            categoryCode: "TD"
        };
        await testSession.post('/admin/categories/category').send(payload);
        return testSession.post('/admin/categories/category').send(payload)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });
});