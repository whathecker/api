const brandDB = require('../../../../../../../infra/data-access/brand-db');
const serverStarter = require('../../../../../serverStarter');
const session = require('supertest-session');
serverStarter.loadMiddlewares();
let testSession = session(serverStarter.app);

describe('Test admin brand endpoints', () => {

    afterAll(async () => {
        await brandDB.dropAll();
    });

    test('getBrands success', () => {
        return testSession.get('/admin/brands')
        .then(response => {
            expect(response.status).toBe(200);
        });
    });

    test('createBrand fail - bad request', () => {
        return testSession.post('/admin/brands/brand')
        .send({})
        .then(response => {
            expect(response.status).toBe(400);
        });
    });

    test('createBrand success', () => {
        return testSession.post('/admin/brands/brand')
        .send({
            brandName: "test",
            brandCode: "TT"
        })
        .then(response => {
            expect(response.status).toBe(201);
        });
    });

    test('createBrand fail = duplicated code', async () => {
        const payload = {
            brandName: "test2",
            brandCode: "TD"
        };
        await testSession.post('/admin/brands/brand').send(payload);
        return testSession.post('/admin/brands/brand').send(payload)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });
});
