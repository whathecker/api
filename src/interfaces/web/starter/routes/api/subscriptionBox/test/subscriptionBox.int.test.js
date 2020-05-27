const packageDB = require('../../../../../../../infra/data-access/subscriptionBox-db');
const serverStarter = require('../../../../../starter');
const session = require('supertest-session');
serverStarter.loadMiddlewares();
let testSession = session(serverStarter.app);

let payload = {
    name: "Package 1",
    channel: "EU",
    items: ["1", "2"],
    prices: [{
        region: "eu",
        currency: "euro",
        price: "19.00",
        vat: "3.30",
        netPrice: "15.70"
    }],
    boxType: "dry",
    boxTypeCode: "DR",
    creationDate: new Date('December 17, 1995 03:24:00'),
    lastModified: new Date('December 17, 1999 03:24:00') 
};

describe('Test subscriptionBoxes endpoint', () => {
    
    afterEach(async () => {
        await packageDB.dropAll();
    });

    afterAll(async () => {
        await packageDB.dropAll();
    });

    test('listSubscriptionBoxes success', () => {
        return testSession.get('/subscriptionBoxes')
        .then(response => {
            expect(response.status).toBe(200);
        });
    });

    // test for getSubscriptionBoxById

    test('createSubscriptionBox fail - bad request', () => {
        return testSession.post('/subscriptionBoxes/subscriptionBox')
        .send({})
        .then(response => {
            expect(response.status).toBe(400);
        });
    });

    test('createSubscriptionBox success', () => {
        return testSession.post('/subscriptionBoxes/subscriptionBox')
        .send(payload)
        .then(response => {
            expect(response.status).toBe(201);
        });
    });

    test('createSubscriptionBox fail - invalid payload', () => {
        let deepCopiedPayload = JSON.parse(JSON.stringify(payload));
        deepCopiedPayload.channel = "ODD CHANNEL";
        return testSession.post('/subscriptionBoxes/subscriptionBox')
        .send(deepCopiedPayload)
        .then(response => {
            expect(response.status).toBe(422);
        }); 
    });
    
    test('createSubscriptionBox fail - duplicated packageId', async () => {
        const response = await testSession.post('/subscriptionBoxes/subscriptionBox').send(payload);
        const packageId = response.body.subscriptionBox.packageId;
        let deepCopiedPayload = JSON.parse(JSON.stringify(payload));
        deepCopiedPayload.packageId = packageId;
        return testSession.post('/subscriptionBoxes/subscriptionBox')
        .send(deepCopiedPayload)
        .then(response => {
            expect(response.status).toBe(422);
        }); 
    });
});