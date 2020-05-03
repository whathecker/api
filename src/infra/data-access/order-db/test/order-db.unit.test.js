const orderDB = require('../index');
let mockOrders = require('./_mock');


describe('Test database access layer of order object', () => {

    const _orderNumber_holder = {
        0: null,
        1: null
    };

    beforeEach(async () => {
        await orderDB.dropAll();
        
        const order = await orderDB.addOrder(mockOrders[0]);
        const order2 = await orderDB.addOrder(mockOrders[1]);

        _orderNumber_holder[0] = order.orderNumber;
        _orderNumber_holder[1] = order2.orderNumber;
    });

    afterAll(async () => {
        await orderDB.dropAll();
    });

    test('list all orders', async () => {
        const orders = await orderDB.listOrders();
        expect(orders).toHaveLength(2);
    });

    test('find order by orderNumber', async () => {
        const orderNum = _orderNumber_holder[0];

        const order = await orderDB.findOrderByOrderNumber(orderNum);
        console.log(order);
        const {_id, orderNumber, ...rest} = order;

        expect(rest).toEqual(mockOrders[0]);
    });

    test('add a new order', async () => {
        const payload = {
            country: "NL",
            user_id: "2",
            /*
            billingAddress: {
                firstName: "Yunjung",
                lastName: "Oh",
                mobileNumber: "06151515",
                postalCode: "1093TV",
                houseNumber: "100",
                streetName: "Randomstraat",
                country: "The Netherlands"
            },
            shippingAddress: {
                firstName: "Yunjung",
                lastName: "Oh",
                mobileNumber: "06151515",
                postalCode: "1093TV",
                houseNumber: "100",
                streetName: "Randomstraat",
                country: "The Netherlands"
            }, */
            isSubscription: true,
            orderStatus: {
                status: "RECEIVED",
                timestamp: new Date('December 14, 1995 03:24:00')
            },
            orderStatusHistory: [
                {
                    status: "RECEIVED",
                    timestamp: new Date('December 14, 1995 03:24:00')
                }
            ],
            paymentMethod: {
                type: "mastercard",
                recurringDetail: "billing_id"
            },
            paymentStatus: {
                status: "OPEN",
                timestamp: new Date('December 14, 1995 03:24:00')
            },
            paymentHistory: [
                {
                    status: "OPEN",
                    timestamp: new Date('December 14, 1995 03:24:00')
                }
            ],
            creationDate: new Date('December 14, 1995 03:24:00'),
            deliverySchedule: new Date('December 24, 1995 03:24:00'),
            isShipped: false,
            isConfEmailDelivered: true,
            lastModified: new Date('December 14, 1995 03:24:00'),
            orderAmountPerItem: [
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
        
                }
            ],
            orderAmount: {
                currency: "euro",
                totalAmount: "24.95",
                totalDiscount: "0.00",
                totalVat: "4.33",
                totalNetPrice: "20.62"
            },
            shippedAmountPerItem: [
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
        
                }
            ]
        };

        const newOrder = await orderDB.addOrder(payload);
        const {_id, orderNumber, ...rest} = newOrder;

        expect(rest).toEqual(payload);
    });

    test('delete a order by orderNumber', async () => {
        const orderNum = _orderNumber_holder[1];

        const result = await orderDB.deleteOrderByOrderNumber(orderNum);
        const orders = await orderDB.listOrders();

        expect(result.status).toBe('success');
        expect(result.orderNumber).toEqual(orderNum);
        expect(orders).toHaveLength(1);
    });

    test('drop all orders in db', async () => {
        await orderDB.dropAll();
        const orders = await orderDB.listOrders();

        expect(orders).toHaveLength(0);
    });
});