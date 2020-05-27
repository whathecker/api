const productDB = require('../../../../../../../infra/data-access/product-db');
const serverStarter = require('../../../../../starter');
const session = require('supertest-session');
serverStarter.loadMiddlewares();
let testSession = session(serverStarter.app);

let payload = {
    channel: "EU",
    name: "Skim Supplement Sheetmask",
    description: "This sheetmask is good for something",
    category: "Sheetmask",
    categoryCode: "ST",
    brand: "Missha",
    brandCode: "MS",
    skinType: "oily",
    inventory: {
        quantityOnHand: 30,
        quarantaine: 0
    },
    inventoryHistory: [
        {
            quantityOnHand: 30,
            quarantaine: 0
        },
    ],
    prices: [
        {
            region: "eu",
            currency: "euro",
            price: "2.95",
            vat: "0.51",
            netPrice: "2.44"
        }
    ]
}

describe('Test products endpoints', () => {
    
    afterEach(async () => {
        await productDB.dropAll();
    });

    afterAll(async () => {
        await productDB.dropAll();
    });

    test('listProducts success', () => {
        return testSession.get('/products')
        .then(response => {
            expect(response.status).toBe(200);
        });
    });

    test('getProductById fail - unknown productId', () => {
        return testSession.get('/products/product/oddid')
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('getProductById success', async () => {
        const response = await testSession.post('/products/product').send(payload);
        const productId = response.body.product.productId;
        return testSession.get(`/products/product/${productId}`)
        .then(response => {
            expect(response.status).toBe(200);
            //TODO: check product info
        });
    });

    test('createProduct fail - bad request', () => {
        return testSession.post('/products/product')
        .send({})
        .then(response => {
            expect(response.status).toBe(400);
        });
    });

    test('createProduct success', () => {
        return testSession.post('/products/product').send(payload)
        .then(response => {
            expect(response.status).toBe(201);
            //TODO: check product info
        });
    });

    test('createProduct fail - invalid payload', () => {
        let deepCopiedPayload = JSON.parse(JSON.stringify(payload));
        deepCopiedPayload.channel = "ODD";
        return testSession.post('/products/product').send(deepCopiedPayload)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('createProduct fail - duplicated productId', async () => {
        const response = await testSession.post('/products/product').send(payload);
        const productId = response.body.product.productId;
        let deepCopiedPayload = JSON.parse(JSON.stringify(payload));
        deepCopiedPayload.productId = productId;
        return testSession.post(`/products/product`).send(deepCopiedPayload)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('updateProduct fail - bad request', async () => {
        const response = await testSession.post('/products/product').send(payload);
        const productId = response.body.product.productId;
        let deepCopiedPayload = JSON.parse(JSON.stringify(payload));
        delete deepCopiedPayload.channel;
        return testSession.put(`/products/product/${productId}`).send(deepCopiedPayload)
        .then(response => {
            expect(response.status).toBe(400);
        });
    });

    test('updateProduct fail - unknown productId', async () => {
        const response = await testSession.post('/products/product').send(payload);
        let deepCopiedPayload = JSON.parse(JSON.stringify(payload));
        deepCopiedPayload.name = "updated name";
        return testSession.put('/products/product/oddid').send(deepCopiedPayload)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('updateProduct fail - invalid payload', async () => {
        const response = await testSession.post('/products/product').send(payload);
        const productId = response.body.product.productId;
        let deepCopiedPayload = JSON.parse(JSON.stringify(payload));
        deepCopiedPayload.channel = "odd channel";
        return testSession.put(`/products/product/${productId}`).send(deepCopiedPayload)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('updateProduct success - name and description', async () => {
        const response = await testSession.post('/products/product').send(payload);
        const productId = response.body.product.productId;
        let deepCopiedPayload = JSON.parse(JSON.stringify(payload));
        deepCopiedPayload.name = "updated name";
        deepCopiedPayload.description = "updated description";

        return testSession.put(`/products/product/${productId}`).send(deepCopiedPayload)
        .then(response => {
            expect(response.status).toBe(200);
        });
    });

    test('deleteProductById fail - unknown productId', () => {
        return testSession.delete('/products/product/oddid')
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('deleteProductById success', async () => {
        const response = await testSession.post('/products/product').send(payload);
        const productId = response.body.product.productId;
        return testSession.delete(`/products/product/${productId}`)
        .then(response => {
            expect(response.status).toBe(200);
        });
    });
});