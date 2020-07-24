const packageDB = require('../../../../../../../../infra/data-access/subscriptionBox-db');
const serverStarter = require('../../../../../../serverStarter');
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

    test('getSubscriptionBoxById fail - unknown packageId', () => {
        return testSession.get('/subscriptionBoxes/subscriptionBox/oddid')
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('getSubscriptionBoxById success', async () => {
        const response = await testSession.post('/subscriptionBoxes/subscriptionBox').send(payload);
        const packageId = response.body.subscriptionBox.packageId;
        return testSession.get(`/subscriptionBoxes/subscriptionBox/${packageId}`)
        .then(response => {
            expect(response.status).toBe(200);
        });
    });

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

    test('updateSubscriptionBox fail - bad request', async () => {
        const response = await testSession.post('/subscriptionBoxes/subscriptionBox').send(payload);
        const packageId = response.body.subscriptionBox.packageId;
        let deepCopiedPayload = JSON.parse(JSON.stringify(payload));
        delete deepCopiedPayload.name;
        return testSession.put(`/subscriptionBoxes/subscriptionBox/${packageId}`).send(deepCopiedPayload)
        .then(response => {
            expect(response.status).toBe(400);
        });
    });

    test('updateSubscriptionBox fail - unknown packageId', async () => {
        await testSession.post('/subscriptionBoxes/subscriptionBox').send(payload);
        let deepCopiedPayload = JSON.parse(JSON.stringify(payload));
        deepCopiedPayload.name = 'updated name';
        return testSession.put('/subscriptionBoxes/subscriptionBox/oddID').send(deepCopiedPayload)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('updateSubscriptionBox fail - invalid payload', async () => {
        const response = await testSession.post('/subscriptionBoxes/subscriptionBox').send(payload);
        const packageId = response.body.subscriptionBox.packageId;
        let deepCopiedPayload = JSON.parse(JSON.stringify(payload));
        deepCopiedPayload.channel = "invalid channel";
        return testSession.put(`/subscriptionBoxes/subscriptionBox/${packageId}`).send(deepCopiedPayload)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('updateSubscriptionBoxs fail - cannot update boxType & boxTypeCode', async () => {
        const response = await testSession.post('/subscriptionBoxes/subscriptionBox').send(payload);
        const packageId = response.body.subscriptionBox.packageId;
        let deepCopiedPayload = JSON.parse(JSON.stringify(payload));
        deepCopiedPayload.boxType = "updated";
        deepCopiedPayload.boxTypeCode = "UT";
        return testSession.put(`/subscriptionBoxes/subscriptionBox/${packageId}`).send(deepCopiedPayload)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('updateSubscriptionBox success - name', async () => {
        const response = await testSession.post('/subscriptionBoxes/subscriptionBox').send(payload);
        const packageId = response.body.subscriptionBox.packageId;
        let deepCopiedPayload = JSON.parse(JSON.stringify(payload));
        deepCopiedPayload.name = "updated name";

        const updateResult = await testSession.put(`/subscriptionBoxes/subscriptionBox/${packageId}`).send(deepCopiedPayload);
        const updated = await testSession.get(`/subscriptionBoxes/subscriptionBox/${packageId}`);
        
        expect(updateResult.status).toBe(200);
        expect(updated.body.name).toBe(deepCopiedPayload.name);
    });

    test('updateSubscriptionBox success - items', async () => {
        const response = await testSession.post('/subscriptionBoxes/subscriptionBox').send(payload);
        const packageId = response.body.subscriptionBox.packageId;
        let deepCopiedPayload = JSON.parse(JSON.stringify(payload));
        deepCopiedPayload.items = ["1", "2", "3"];

        const updateResult = await testSession.put(`/subscriptionBoxes/subscriptionBox/${packageId}`).send(deepCopiedPayload);
        const updated = await testSession.get(`/subscriptionBoxes/subscriptionBox/${packageId}`);

        expect(updateResult.status).toBe(200);
        expect(updated.body.items).toEqual(deepCopiedPayload.items);
    });

    test('updateSubscriptionBox success - prices', async () => {
        const response = await testSession.post('/subscriptionBoxes/subscriptionBox').send(payload);
        const packageId = response.body.subscriptionBox.packageId;
        let deepCopiedPayload = JSON.parse(JSON.stringify(payload));
        deepCopiedPayload.prices[0] = {
            region: "eu",
            currency: "euro",
            price: "150.50"
        };

        const updateResult = await testSession.put(`/subscriptionBoxes/subscriptionBox/${packageId}`).send(deepCopiedPayload);
        const updated = await testSession.get(`/subscriptionBoxes/subscriptionBox/${packageId}`);

        expect(updateResult.status).toBe(200);
        expect(updated.body.prices[0].region).toBe("eu");
        expect(updated.body.prices[0].currency).toBe("euro");
        expect(updated.body.prices[0].price).toBe("150.50");
        expect(updated.body.prices[0].vat).toBe("26.12");
        expect(updated.body.prices[0].netPrice).toBe("124.38");
        expect(updated.body.packageId).toBe(packageId);
    });

    test('deleteSubscriptionBoxById - unknonw packageId', () => {
        return testSession.delete('/subscriptionBoxes/subscriptionBox/oddid')
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('deleteSubscriptionBoxById success', async () => {
        const response = await testSession.post('/subscriptionBoxes/subscriptionBox').send(payload);
        const packageId = response.body.subscriptionBox.packageId;
        return testSession.delete(`/subscriptionBoxes/subscriptionBox/${packageId}`)
        .then(response => {
            expect(response.status).toBe(200);
        });
    });
});