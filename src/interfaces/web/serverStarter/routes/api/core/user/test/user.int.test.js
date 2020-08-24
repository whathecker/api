const userDB = require('../../../../../../../../infra/data-access/user-db');
const addressDB = require('../../../../../../../../infra/data-access/address-db');
const billingDB = require('../../../../../../../../infra/data-access/billing-db');
const subscriptionDB = require('../../../../../../../../infra/data-access/subscription-db');
const packageDB = require('../../../../../../../../infra/data-access/subscriptionBox-db');

const serverStarter = require('../../../../../../serverStarter');
const session = require('supertest-session');
const orderDb = require('../../../../../../../../infra/data-access/order-db');
serverStarter.loadMiddlewares();
let testSession = session(serverStarter.app);

let payload_user = {
    email: "yunjae.oh.nl@hellochokchok.com",
    userId: "10",
    hash: " ",
    salt: " ",
    firstName: "Yunjae",
    lastName: "Oh",
    mobileNumber: "06151515",
    addresses: [],
    defaultShippingAddress: "",
    defaultBillingAddress: "",
    defaultBillingOption: "pm_12789",
    billingOptions: ["pm_12789", "pm_12860"],
    subscriptions: ["ECSBNL1272839300"],
    orders: ["ECNL8092519999"],
    creationDate: new Date('December 14, 1995 03:24:00'),
    lastModified: new Date('December 24, 1995 03:24:00'),
    isEmailVerified: false,
    newsletterOptin: false
};

let payload_addresses = [
    {
        user_id: "10",
        firstName: "Yunjae",
        lastName: "Oh",
        mobileNumber: "0615151515",
        postalCode: "1034AA",
        houseNumber: "10",
        houseNumberAdd: "A",
        streetName: "Randomstraat",
        city: "Amsterdam",
        province: "Noord-Holland",
        country: "Netherlands"
    },
    {
        user_id: "10",
        firstName: "Junseok",
        lastName: "Oh",
        mobileNumber: "0615141415",
        postalCode: "1044AA",
        houseNumber: "5",
        houseNumberAdd: " ",
        streetName: "Anotherstraat",
        city: "Amsterdam",
        province: "Noord-Holland",
        country: "Netherlands"
    }
];

let payload_billings = [
    {
        user_id: "10",
        type: "visa",
        billingId: "pm_12789",
        tokenRefundStatus: "NOT_REQUIRED",
        creationDate: new Date('December 17, 1998 03:24:00'),
        lastModified: new Date('December 17, 1999 03:24:00')
    },
    {
        user_id: "10",
        type: "visa",
        billingId: "pm_12860",
        tokenRefundStatus: "NOT_REQUIRED",
        creationDate: new Date('December 17, 1998 03:24:00'),
        lastModified: new Date('December 17, 1999 03:24:00')
    },
];

let payload_subscription = {
    country: "NL",
    channel: "EU",
    subscriptionId: "ECSBNL1272839300",
    deliveryFrequency: 28,
    deliveryDay: 4,
    isWelcomeEmailSent: true,
    orders: ["ECNL8092519999"],
    isActive: true,
    deliverySchedules: [{
        orderNumber: "ECNL8092517700",
        nextDeliveryDate: new Date('December 17, 1995 03:24:00'),
        year: 1995,
        month: 11,
        date: 17,
        day: 0,
    }],
    subscribedItems: [
        {
            itemId: "PKOL91587",
            quantity: 1
        },
    ],
    user_id: "10",
    paymentMethod_id: "pm_12789",
    creationDate: new Date('December 14, 1995 03:24:00'),
    lastModified: new Date('December 24, 1995 03:24:00'),
};

let payload_order = {
    country: "NL",
    user_id: "10",
    orderNumber: "ECNL8092519999",
    billingAddress: {
        firstName: "Yunsoo",
        lastName: "Oh",
        mobileNumber: "06151515",
        postalCode: "1093TV",
        houseNumber: "100",
        houseNumberAdd: " ",
        streetName: "Randomstraat",
        country: "The Netherlands"
    },
    shippingAddress: {
        firstName: "Yunsoo",
        lastName: "Oh",
        mobileNumber: "06151515",
        postalCode: "1093TV",
        houseNumber: "100",
        houseNumberAdd: " ",
        streetName: "Randomstraat",
        country: "The Netherlands"
    }, 
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
            itemId: "PKOL91587",
            name: "Package 1",
            currency: "euro",
            quantity: 1,
            originalPrice: "19.00",
            discount: "0.00",
            vat: "3.30",
            grossPrice: "19.00",
            netPrice: "15.70",
            sumOfGrossPrice: "19.00",
            sumOfNetPrice: "15.70",
            sumOfVat: "3.30",
            sumOfDiscount: "0.00"

        }
    ],
    orderAmount: {
        currency: "euro",
        totalAmount: "19.00",
        totalDiscount: "0.00",
        totalVat: "3.30",
        totalNetPrice: "15.70"
    },
    shippedAmountPerItem: [
        {
            itemId: "PKOL91587",
            name: "Package 1",
            currency: "euro",
            quantity: 1,
            originalPrice: "19.00",
            discount: "0.00",
            vat: "3.30",
            grossPrice: "19.00",
            netPrice: "15.70",
            sumOfGrossPrice: "19.00",
            sumOfNetPrice: "15.70",
            sumOfVat: "3.30",
            sumOfDiscount: "0.00"

        }
    ]
};

let payload_package = {
    name: "Package 1",
    packageId: "PKOL91587",
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

describe('Test user endpoints', () => {

    const _address_id_holder = {
        0: null,
        1: null
    };

    beforeEach(async () => {
        const address = await addressDB.addAddress(payload_addresses[0]);
        const address2 = await addressDB.addAddress(payload_addresses[1]);

        _address_id_holder[0] = address._id.toString();
        _address_id_holder[1] = address2._id.toString();
        
        await billingDB.addBilling(payload_billings[0]);
        await billingDB.addBilling(payload_billings[1]);

        await subscriptionDB.addSubscription(payload_subscription);
        
        await packageDB.addSubscriptionBox(payload_package);

        await orderDb.addOrder(payload_order);

        payload_user.addresses = [_address_id_holder[0], _address_id_holder[1]];
        payload_user.defaultShippingAddress = _address_id_holder[0];
        payload_user.defaultBillingAddress = _address_id_holder[1];

        await userDB.addUser(payload_user);
    });
    
    afterEach(async () => {
        await userDB.dropAll();
        await addressDB.dropAll();
        await billingDB.dropAll();
        await subscriptionDB.dropAll();
        await orderDb.dropAll();
        await packageDB.dropAll();
    });

    afterAll(async () => {
        await userDB.dropAll();
        await addressDB.dropAll();
        await billingDB.dropAll();
        await subscriptionDB.dropAll();
        await orderDb.dropAll();
        await packageDB.dropAll();
    });

    test('getUserDetail fail - no user found', () => {
        return testSession.get('/users/user/odd_id')
        .then(response => {
            expect(response.status).toBe(404);
        });
    });

    test('getUserDetail success', () => {
        const userId = payload_user.userId;
        return testSession.get(`/users/user/${userId}`)
        .then(response => {
            const userData = response.body;

            expect(response.status).toBe(200);

            expect(userData.email).toBe(payload_user.email);
            expect(userData.firstName).toBe(payload_user.firstName);
            expect(userData.lastName).toBe(payload_user.lastName);
            expect(userData.mobileNumber).toBe(payload_user.mobileNumber);

            expect(userData.address.streetName).toBe(payload_addresses[0].streetName);
            expect(userData.address.houseNumber).toBe(payload_addresses[0].houseNumber);
            expect(userData.address.houseNumberAdd).toBe(payload_addresses[0].houseNumberAdd);
            expect(userData.address.city).toBe(payload_addresses[0].city);
            expect(userData.address.province).toBe(payload_addresses[0].province);
            expect(userData.address.country).toBe(payload_addresses[0].country);

            expect(userData.subscription.id).toBe(payload_subscription.subscriptionId);
            expect(userData.subscription.deliveryFrequency).toBe(payload_subscription.deliveryFrequency);
            expect(userData.subscription.deliveryDay).toBe(payload_subscription.deliveryDay);
            expect(userData.subscription.nextDelivery).toMatchObject({
                orderNumber: "ECNL8092517700",
                year: 1995,
                month: 11,
                date: 17,
                day: 0,
            });

            expect(userData.billingOptions).toHaveLength(2);

            expect(userData.subscribedItems).toHaveLength(1);
            expect(userData.subscribedItems[0].packageId).toBe(payload_package.packageId);
        });
    });

    test('getUserAddresses fail - invalid userId', () => {
        return testSession.get('/users/user/odd_id/addresses')
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('getUserAddresses success', () => {
        const userId = payload_user.userId;
        return testSession.get(`/users/user/${userId}/addresses`)
        .then(response => {
            const addressData = response.body;

            expect(response.status).toBe(200);

            expect(addressData.addresses).toHaveLength(2);

            expect(addressData.shippingAddress).toMatchObject(payload_addresses[0]);
            expect(addressData.billingAddress).toMatchObject(payload_addresses[1]);
        });
    });

    test('upsertAddress fail - bad request', () => {
        const userId = payload_user.userId;
        return testSession.put(`/users/user/${userId}/addresses/address`)
        .send({})
        .then(response => {
            expect(response.status).toBe(400);
        });
    });

    test('upsertAddress fail - user not found', () => {
        const userId = "oddID";
        return testSession.put(`/users/user/${userId}/addresses/address`)
        .send({
            firstName: "Yunjae",
            lastName: "Oh",
            mobileNumber: "0615151515",
            postalCode: "1034AA",
            houseNumber: "10",
            houseNumberAdd: "A",
            streetName: "Randomstraat",
            city: "Amsterdam",
            province: "Noord-Holland",
            country: "Netherlands"
        })
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('upsertAddress success - new address is created', async () => {
        const userId = payload_user.userId;

        const res1 = await testSession.put(`/users/user/${userId}/addresses/address`)
        .send({
            firstName: "Tais",
            lastName: "Elize",
            mobileNumber: "0615151515",
            postalCode: "1034WK",
            houseNumber: "10",
            houseNumberAdd: " ",
            streetName: "Jimthorpepad",
            city: "Amsterdam",
            province: "Noord-Holland",
            country: "Netherlands"
        })

        const res2 = await testSession.get(`/users/user/${userId}/addresses`);

        expect(res1.status).toBe(201);
        expect(res2.body.addresses).toHaveLength(3);
    }); 

    test('upsertAddress fail - cannot update address, as it is unknown address', () => {
        const userId = payload_user.userId;
        return testSession.put(`/users/user/${userId}/addresses/address`)
        .send({
            id: "500",
            firstName: "Tais",
            lastName: "Elize",
            mobileNumber: "0615151515",
            postalCode: "1034WK",
            houseNumber: "10",
            houseNumberAdd: " ",
            streetName: "Jimthorpepad",
            city: "Amsterdam",
            province: "Noord-Holland",
            country: "Netherlands"
        })
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('upsertAddress success - address is updated', () => {
        const userId = payload_user.userId;
        return testSession.put(`/users/user/${userId}/addresses/address`)
        .send({
            id: _address_id_holder[0],
            firstName: "Tais",
            lastName: "Elize",
            mobileNumber: "0615151515",
            postalCode: "1034WK",
            houseNumber: "10",
            houseNumberAdd: " ",
            streetName: "Jimthorpepad",
            city: "Amsterdam",
            province: "Noord-Holland",
            country: "Netherlands"
        })
        .then(response => {
            expect(response.status).toBe(200);
        });
    });

    test('updateUserContactInfo fail - bad request, missing mandatory parameters', () => {
        const userId = payload_user.userId;
        return testSession.put(`/users/user/${userId}/contact`)
        .send({})
        .then(response => {
            expect(response.status).toBe(400);
        });
    });

    test('updateUserContactInfo fail - user not found', () => {
        const userId = "120-42395234";
        return testSession.put(`/users/user/${userId}/contact`)
        .send({
            firstName: "Mickey",
            lastName: "Mouse"
        })
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('updateUserContactInfo success - with mobileNumber', () => {
        const userId = payload_user.userId;
        return testSession.put(`/users/user/${userId}/contact`)
        .send({
            firstName: "Mickey",
            lastName: "Mouse",
            mobileNumber: "06181818"
        })
        .then(response => {
            expect(response.status).toBe(200);
        });
    });

    test('updateUserContactInfo success - without mobileNumber', () => {
        const userId = payload_user.userId;
        return testSession.put(`/users/user/${userId}/contact`)
        .send({
            firstName: "Mickey",
            lastName: "Mouse"
        })
        .then(response => {
            expect(response.status).toBe(200);
        });
    });

    test('deleteAddress fail - user not found', () => {
        const userId = "odd_id";
        return testSession.delete(`/users/user/${userId}/addresses/address/10`)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('deleteAddress fail - cannot delete defaultShippingAddress', () => {
        const userId = payload_user.userId;
        const defaultShipping_id = _address_id_holder[0];
        return testSession.delete(`/users/user/${userId}/addresses/address/${defaultShipping_id}`)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('deleteAddress fail - cannot delete defaultBillingAddress', () => {
        const userId = payload_user.userId;
        const defaultBilling_id = _address_id_holder[1];
        return testSession.delete(`/users/user/${userId}/addresses/address/${defaultBilling_id}`)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('deleteAddress success', async () => {
        const userId = payload_user.userId;

        await testSession.put(`/users/user/${userId}/addresses/address`)
        .send({
            firstName: "Tais",
            lastName: "Elize",
            mobileNumber: "0615151515",
            postalCode: "1034WK",
            houseNumber: "10",
            houseNumberAdd: " ",
            streetName: "Jimthorpepad",
            city: "Amsterdam",
            province: "Noord-Holland",
            country: "Netherlands"
        });

        const response = await testSession.get(`/users/user/${userId}/addresses`);
        const { addresses } = response.body;

        const newAddress = addresses[addresses.length - 1];

        const res1 = await testSession.delete(`/users/user/${userId}/addresses/address/${newAddress._id}`);
        const res2 = await testSession.get(`/users/user/${userId}/addresses`);

        expect(res1.status).toBe(200);
        expect(res2.body.addresses).toHaveLength(2);
    });

    test('getUserOrders fail - no user found', () => {
        const userId = "odd_id";

        return testSession.get(`/users/user/${userId}/orders`)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('getUserOrders success', () => {
        const userId = payload_user.userId;

        return testSession.get(`/users/user/${userId}/orders`)
        .then(response => {
            const orders = response.body;
            expect(response.status).toBe(200);
            expect(orders).toHaveLength(1);
        });
    });

    test('getUserOrders success - return no orders', async () => {
        const deepCopiedPayload = JSON.parse(JSON.stringify(payload_user));
        deepCopiedPayload.userId = "13";
        deepCopiedPayload.email = "yunjae.oh.kr@hellochokchok.com"
        await userDB.addUser(deepCopiedPayload);
        const userId = deepCopiedPayload.userId;

        return testSession.get(`/users/user/${userId}/orders`)
        .then(response => {
            const orders = response.body;
            expect(response.status).toBe(200);
            expect(orders).toHaveLength(0);
        });
    });

    test('getUserSubscription fail - no user found', () => {
        const userId = "odd_id";

        return testSession.get(`/users/user/${userId}/subscription`)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('getUserSubscription success', () => {
        const userId = payload_user.userId;

        return testSession.get(`/users/user/${userId}/subscription`)
        .then(response => {
            const subscriptions = response.body;
            expect(response.status).toBe(200);
            expect(subscriptions).toHaveLength(1);
        });
    });

});
