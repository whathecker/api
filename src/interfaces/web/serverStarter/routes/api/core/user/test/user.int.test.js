const userDB = require('../../../../../../../../infra/data-access/user-db');
const addressDB = require('../../../../../../../../infra/data-access/address-db');
const billingDB = require('../../../../../../../../infra/data-access/billing-db');
const subscriptionDB = require('../../../../../../../../infra/data-access/subscription-db');
const packageDB = require('../../../../../../../../infra/data-access/subscriptionBox-db');

const serverStarter = require('../../../../../../serverStarter');
const session = require('supertest-session');
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
    orders: ["ECNL8092518800"],
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
    orders: ["ECNL8092518800"],
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
        await packageDB.dropAll();
    });

    afterAll(async () => {
        await userDB.dropAll();
        await addressDB.dropAll();
        await billingDB.dropAll();
        await subscriptionDB.dropAll();
        await packageDB.dropAll();
    });

    test('getUserDetail return no user', () => {
        return testSession.get('/users/user/odd_id')
        .then(response => {
            expect(response.status).toBe(204);
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

    test('getUserAddresses return no data - user not found', () => {
        return testSession.get('/users/user/odd_id/addresses')
        .then(response => {
            expect(response.status).toBe(204);
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
});
