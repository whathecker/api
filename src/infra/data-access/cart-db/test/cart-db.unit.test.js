const cartDB = require('../index');
let mockCarts = require('./_mock');

describe('Test database access layer of cart object', () => {

    const _cart_id_holder = {
        0: null,
        1: null,
    };

    beforeEach(async () => {
        await cartDB.dropAll();

        const cart = await cartDB.addCart(mockCarts[0]);
        const cart2 = await cartDB.addCart(mockCarts[1]);

        _cart_id_holder[0] = cart._id;
        _cart_id_holder[1] = cart2._id;
    });

    afterAll(async () => {
        await cartDB.dropAll();
    });

    test('list all carts', async () => {
        const carts = await cartDB.listCarts();
        expect(carts).toHaveLength(2);
    });

    test('find cart by id', async () => {
        const id = _cart_id_holder[0];

        const cart = await cartDB.findCartById(id);

        const {
            _id,
            anonymous_id,
            ...rest
        } = cart;

        console.log(rest);

        expect(rest).toEqual(mockCarts[0]);
    });

    test('add a new cart', async () => {
        const payload = {
            country: "NL",
            cartState: "MERGED",
            anonymous_id: "2",
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

        const newCart = await cartDB.addCart(payload);

        const {
            _id,
            user_id,
            ...rest
        } = newCart;

        expect(rest).toEqual(payload);
    });

    test('delete a cart by id', async () => {
        const cart_id = _cart_id_holder[1];

        const result = await cartDB.deleteCartById(cart_id);
        const carts = await cartDB.listCarts();

        expect(result.status).toBe('success');
        expect(result.id).toEqual(cart_id);
        expect(carts).toHaveLength(1);
    });

    test('drop all carts in db', async () => {
        await cartDB.dropAll();
        const carts = await cartDB.listCarts();

        expect(carts).toHaveLength(0);
    });
});