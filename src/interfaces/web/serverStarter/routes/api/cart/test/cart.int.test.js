const cartDB = require('../../../../../../../infra/data-access/cart-db');
const serverStarter = require('../../../../../serverStarter');
const session = require('supertest-session');
serverStarter.loadMiddlewares();
let testSession = session(serverStarter.app);

let payload = {
    country: "NL",
    cartState: "ACTIVE",
    user_id: "1",
    isSubscription: true,
    lineItems: [
        {
            itemId: "PKOL90587",
            name: "chokchok 'oily' skin type package",
            currency: "euro",
            quantity: 1,
            originalPrice: "24.95",
            discount: "0.00",
            vat: "4.33",
            grossPrice: "24.95",
            netPrice: "20.62",
            sumOfGrossPrice: "24.95",
            sumOfNetPrice: "20.62",
            sumOfVat: "4.33",
            sumOfDiscount: "0.00"

        },
        {
            itemId: "PKOL90585",
            name: "chokchok 'normal' skin type package",
            currency: "euro",
            quantity: 1,
            originalPrice: "24.95",
            discount: "0.00",
            vat: "4.33",
            grossPrice: "24.95",
            netPrice: "20.62",
            sumOfGrossPrice: "24.95",
            sumOfNetPrice: "20.62",
            sumOfVat: "4.33",
            sumOfDiscount: "0.00"
        }
    ],
    totalPrice: {
        currency: "euro",
        totalAmount: "49.90",
        totalDiscount: "0.00",
        totalVat: "8.66",
        totalNetPrice: "41.24"
    },
    billingAddress: {
        firstName: "Yunjae",
        lastName: "Oh",
        mobileNumber: "06151515",
        postalCode: "1093TV",
        houseNumber: "100",
        houseNumberAdd: " ",
        streetName: "Randomstraat",
        country: "The Netherlands"
    },
    shippingAddress: {
        firstName: "Yunjae",
        lastName: "Oh",
        mobileNumber: "06151515",
        postalCode: "1093TV",
        houseNumber: "100",
        houseNumberAdd: " ",
        streetName: "Randomstraat",
        country: "The Netherlands"
    },
    shippingInfo: {
        shippingMethod: "standard",
        price: {
            currency: "euro",
            amount: "0.00"
        }
    },
    paymentInfo: {
        paymentMethodType: "visa",
        paymentId: "id"
    },
};

describe('Test carts endpoints', () => {

    afterEach(async () => {
        await cartDB.dropAll();
    });

    afterAll(async () => {
        await cartDB.dropAll();
    });

    test('listCarts success', () => {
        return testSession.get('/carts')
        .then(response => {
            expect(response.status).toBe(200);
        });
    });

    test('getCartById fail - unknown id', () => {
        return testSession.get('/carts/cart/oddid')
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('getCartById success', async () => {
        const response = await testSession.post('/carts/cart').send(payload);
        const cart_id = response.body.cart._id;
        return testSession.get(`/carts/cart/${cart_id}`)
        .then(response => {
            expect(response.status).toBe(200);
        });
    });

    test('createCart fail - bad request', () => {
        return testSession.post('/carts/cart').send({})
        .then(response => {
            expect(response.status).toBe(400);
        });
    });

    test('createCart success', () => {
        return testSession.post('/carts/cart').send(payload)
        .then(response => {
            expect(response.status).toBe(201);
        });
    });

    test('createCart fail - invalid cartState', () => {
        let deepCopiedPayload = JSON.parse(JSON.stringify(payload));
        deepCopiedPayload.cartState = "oddState";
        return testSession.post('/carts/cart').send(deepCopiedPayload)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('createCart fail - invalid shippingMethod', () => {
        let deepCopiedPayload = JSON.parse(JSON.stringify(payload));
        deepCopiedPayload.shippingInfo.shippingMethod = "odd";
        return testSession.post('/carts/cart').send(deepCopiedPayload)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('createCart fail - invalid currency in shippingInfo', () => {
        let deepCopiedPayload = JSON.parse(JSON.stringify(payload));
        deepCopiedPayload.shippingInfo.price.currency = "odd";
        return testSession.post('/carts/cart').send(deepCopiedPayload)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('createCart fail - invalid price format in shippingInfo', () => {
        let deepCopiedPayload = JSON.parse(JSON.stringify(payload));
        deepCopiedPayload.shippingInfo.price.amount = "00";
        return testSession.post('/carts/cart').send(deepCopiedPayload)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('createCart fail - conflict ownership, has both user_id and anonymous_id', () => {
        let deepCopiedPayload = JSON.parse(JSON.stringify(payload));
        deepCopiedPayload.anonymous_id = "1";
        return testSession.post('/carts/cart').send(deepCopiedPayload)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('deleteCartById fail - unknown id', () => {
        return testSession.delete('/carts/cart/oddid')
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('deleteCartById success', async () => {
        const response = await testSession.post('/carts/cart').send(payload);
        const cart_id = response.body.cart._id;
        return testSession.delete(`/carts/cart/${cart_id}`)
        .then(response => {
            expect(response.status).toBe(200);
        });
    });


});