const brandDB = require('../../../../../../../infra/data-access/brand-db');
const serverStarter = require('../../../../../starter');
const session = require('supertest-session');
serverStarter.loadMiddlewares();
let testSession = session(serverStarter.app);

test('Test admin brand endpoints', () => {

    afterAll(async () => {
        await brandDB.dropAll();
    });
});
