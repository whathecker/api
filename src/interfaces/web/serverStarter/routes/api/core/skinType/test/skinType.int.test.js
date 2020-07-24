const skinTypeDB = require('../../../../../../../../infra/data-access/skinType-db');
const serverStarter = require('../../../../../../serverStarter');
const session = require('supertest-session');
serverStarter.loadMiddlewares();
let testSession = session(serverStarter.app);

describe('Test admin skinType endpoints', () => {

    afterEach(async () => {
        await skinTypeDB.dropAll();
    });
    afterAll(async () => {
        await skinTypeDB.dropAll();
    });

    test('listSkinTypes success', () => {
        return testSession.get('/admin/skinTypes')
        .then(response => {
            expect(response.status).toBe(200);
        });
    });

    test('createSkinType fail - bad request', () => {
        return testSession.post('/admin/skinTypes/skinType')
        .send({})
        .then(response => {
            expect(response.status).toBe(400);
        });
    });

    test('createSkinType success', () => {
        return testSession.post('/admin/skinTypes/skinType')
        .send({
            skinType: "oily",
            skinTypeCode: "OL"
        })
        .then(response => {
            expect(response.status).toBe(201);
        });
    });

    test('createSkinType fail - duplicated skinType', async () => {
        const payload = {
            skinType: "normal",
            skinTypeCode: "NM"
        };
        await testSession.post('/admin/skinTypes/skinType').send(payload);
        return testSession.post('/admin/skinTypes/skinType').send(payload)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });
});