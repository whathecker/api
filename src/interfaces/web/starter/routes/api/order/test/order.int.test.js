const orderDB = require('../../../../../../../infra/data-access/order-db');
const serverStarter = require('../../../../../starter');
const session = require('supertest-session');
serverStarter.loadMiddlewares();
let testSession = session(serverStarter.app);

let payload = {
    country: "NL",
    user_id: "1",
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
    // should orderStatus be part of payload? if not shouldn't default status be applied?
    // same goes for payment status
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
    lastModified: new Date('December 14, 1995 03:24:00'),
    deliverySchedule: new Date('December 24, 1995 03:24:00'),
    isShipped: false,
    isConfEmailDelivered: true,
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
    }
};

describe('Test order endpoints', () => {

    afterEach(async () => {
        await orderDB.dropAll();
    });

    afterAll(async () => {
        await orderDB.dropAll();
    });

    

});