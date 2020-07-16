const cartDB = require('../index');
let mockCarts = require('./_mock');

describe('Test database access layer of cart object', () => {

    const _cart_id_holder = {
        0: null,
        1: null,
        2: null
    };

    beforeEach(async () => {
        await cartDB.dropAll();

        const cart = await cartDB.addCart(mockCarts[0]);
        const cart2 = await cartDB.addCart(mockCarts[1]);
        const cart3 = await cartDB.addCart(mockCarts[2]);

        _cart_id_holder[0] = cart._id;
        _cart_id_holder[1] = cart2._id;
        _cart_id_holder[2] = cart3._id;
    });

    afterAll(async () => {
        await cartDB.dropAll();
    });

    test('list all carts', async () => {
        const carts = await cartDB.listCarts();
        expect(carts).toHaveLength(3);
    });

    test('find cart by id', async () => {
        const id = _cart_id_holder[0];

        const cart = await cartDB.findCartById(id);

        const {
            _id,
            user_id,
            ...rest
        } = cart;

        expect(rest).toEqual(mockCarts[0]);
    });

    //TODO:add failed test case when cart is not found for findCartById

    test('add a new cart', async () => {
        const payload = {
            country: "NL",
            cartState: "MERGED",
            anonymous_id: "4",
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

    test('update a cart - add a line item', async () => {
        const cart_id = _cart_id_holder[0];
        let deepCopiedLineItems = JSON.parse(JSON.stringify(mockCarts[0].lineItems));
        const newItem = {
            itemId: "PKOL90588",
            name: "chokchok 'dry' skin type package",
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

        };
        deepCopiedLineItems.push(newItem);

        const updatedCart = await cartDB.updateCartLineItems(cart_id, deepCopiedLineItems);
        
        const {
            lineItems,
            totalPrice
        } = updatedCart;

        expect(lineItems).toEqual(deepCopiedLineItems);
        expect(totalPrice).toEqual({
            currency: "euro",
            totalAmount: "74.85",
            totalDiscount: "0.00",
            totalVat: "12.99",
            totalNetPrice: "61.86"
        });
    });

    test('update a cart - remove a line item', async () => {
        const cart_id = _cart_id_holder[0];
        let deepCopiedLineItems = JSON.parse(JSON.stringify(mockCarts[0].lineItems));
        deepCopiedLineItems.pop();

        const updatedCart = await cartDB.updateCartLineItems(cart_id, deepCopiedLineItems);

        const {
            lineItems,
            totalPrice
        } = updatedCart;

        expect(lineItems).toEqual(deepCopiedLineItems);
        expect(totalPrice).toEqual({
            currency: "euro",
            totalAmount: "24.95",
            totalDiscount: "0.00",
            totalVat: "4.33",
            totalNetPrice: "20.62"
        });
    });

    test('update cartState success - from ACTIVE to ORDERD', async () => {
        const cart_id = _cart_id_holder[0];
        const newCartState = "ORDERED";

        const updatedCart = await cartDB.updateCartState(cart_id, newCartState);

        const { cartState } = updatedCart;
        expect(cartState).toBe(newCartState);
    });

    test('update cartState fail - cannot update terminal state', async () => {
        const cart_id = _cart_id_holder[1];
        const newCartState = "ORDERED";

        await expect(cartDB.updateCartState(cart_id, newCartState)).rejects.toMatchObject({
            status: "fail",
            reason: "error"
        });
    });

    test('update cartState fail - from ACTIVE to MERGED', async () => {
        const cart_id = _cart_id_holder[0];
        const newCartState = "MERGED";

        await expect(cartDB.updateCartState(cart_id, newCartState)).rejects.toMatchObject({
            status: "fail",
            reason: "error"
        });
    });

    test('updateCartOwnerShip success - ACTIVE to MERGED ', async () => {
        const cart_id = _cart_id_holder[0];
        const newCartState = "MERGED";
        
        const updatedCart = await cartDB.updateCartOwnership(cart_id, newCartState);

        const { cartState } = updatedCart;
        expect(cartState).toBe(newCartState);
    });

    test('updateCartOwnership fail - cannot update terminal state', async () => {
        const cart_id = _cart_id_holder[1];
        const newCartState = "MERGED";

        await expect(cartDB.updateCartOwnership(cart_id, newCartState)).rejects.toMatchObject({
            status: "fail",
            reason: "error"
        });
    });

    test('updateCartOwnership fail - cannot update ownership of cart belong to user', async () => {
        const cart_id = _cart_id_holder[2];
        const newCartState = "MERGED";

        await expect(cartDB.updateCartOwnership(cart_id, newCartState)).rejects.toMatchObject({
            status: "fail",
            reason: "error"
        });
    });

    test('updateShippingInfo success', async () => {
        const cart_id = _cart_id_holder[0];
        const newShippingInfo = {
            shippingMethod: "standard",
            price: {
                currency: "euro",
                amount: "3.95"
            }
        };

        const updatedCart = await cartDB.updateCartShippingInfo(cart_id, newShippingInfo);

        const { shippingInfo } = updatedCart;
        expect(shippingInfo).toMatchObject(newShippingInfo);
    });

    test('updatePaymentInfo success', async () => {
        const cart_id = _cart_id_holder[0];
        const newPaymentInfo = {
            paymentMethodType: "master",
            paymentId: "id_2"
        };

        const updatedCart = await cartDB.updateCartPaymentInfo(cart_id, newPaymentInfo);

        const { paymentInfo } = updatedCart;
        expect(paymentInfo).toMatchObject(newPaymentInfo);
    });

    test('delete a cart by id', async () => {
        const cart_id = _cart_id_holder[1];

        const result = await cartDB.deleteCartById(cart_id);
        const carts = await cartDB.listCarts();

        expect(result.status).toBe('success');
        expect(result.id).toEqual(cart_id);
        expect(carts).toHaveLength(2);
    });

    test('drop all carts in db', async () => {
        await cartDB.dropAll();
        const carts = await cartDB.listCarts();

        expect(carts).toHaveLength(0);
    });
});