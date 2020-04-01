const errors = require('./order-error');
const buildCreateOrderObj = require('./order');
const orderSchema = require('./order-schema');
const validator = require('../_shared_validator')(orderSchema);
const createOrderObj = buildCreateOrderObj(validator);

const dummyData = {
    orderNumber: "ECNL8092517600",
    user: "user_id",
    invoiceNumber: "0805081926636",
    billingAddress: {
        firstName: "Yunjae",
        lastName: "Oh",
        mobileNumber: "06151515",
        postalCode: "1093TV",
        houseNumber: "100",
        streetName: "Randomstraat",
        country: "The Netherlands"
    },
    shippingAddress: {
        firstName: "Yunjae",
        lastName: "Oh",
        mobileNumber: "06151515",
        postalCode: "1093TV",
        houseNumber: "100",
        streetName: "Randomstraat",
        country: "The Netherlands"
    },
    isSubscription: true,
    orderStatus: {
        status: "AUTHORIZED",
        timestamp: new Date('December 17, 1995 03:24:00')
    },
    orderStatusHistory: [
        {
            status: "RECEIVED",
            timestamp: new Date('December 14, 1995 03:24:00')
        },
        {
            status: "PAID",
            timestamp: new Date('December 17, 1995 03:24:00')
        }
    ],
    paymentMethod: {
        type: "mastercard",
        recurringDetail: "billing_id"
    },
    paymentStatus: {
        status: "AUTHORIZED",
        timestamp: new Date('December 17, 1995 03:24:00')
    },
    paymentHistory: [
        {
            status: "OPEN",
            timestamp: new Date('December 14, 1995 03:24:00')
        },
        {
            status: "AUTHORIZED",
            timestamp: new Date('December 17, 1995 03:24:00')
        }
    ],
    creationDate: new Date('December 14, 1995 03:24:00'),
    deliverySchedule: new Date('December 24, 1995 03:24:00'),
    isShipped: true,
    shippedDate: new Date('December 24, 1995 03:24:00'),
    courier: 'DHL',
    trackingNumber: ["12345677", "12345436"],
    isConfEmailDelivered: true,
    lastModified: new Date('December 24, 1995 03:24:00'),
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
    orderAmount: {
        currency: "euro",
        totalAmount: "49.90",
        totalDiscount: "0.00",
        totalVat: "8.66",
        totalNetPrice: "41.24"
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
    shippedAmount: {
        currency: "euro",
        totalAmount: "49.90",
        totalDiscount: "0.00",
        totalVat: "8.66",
        totalNetPrice: "41.24"
    }
};

function copyObj(obj) {
    return JSON.parse(JSON.stringify(obj));
}

describe('Type checking: order object', () => {

    test('orderNumber property must be string if exist', () => {
        let payload = copyObj(dummyData);

        const order = createOrderObj(payload);

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.orderNumber.message);
    });

    test('order object must have a user property', () => {
        let payload = copyObj(dummyData);
        delete payload.user;

        const order = createOrderObj(payload);

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.user.message);
    });

    test('user property must be string', () => {
        let payload = copyObj(dummyData);
        payload.user = 0;

        const order = createOrderObj(payload);

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.user.message);
    });

    // type checking for billingAddress object

    test('order object must have billingAddress property', () => {
        let payload = copyObj(dummyData);
        delete payload.billingAddress;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.billingAddress.message);
    });

    test('billingAddress must have firstName property', () => {
        let payload = copyObj(dummyData);
        delete payload.billingAddress.firstName;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.firstName_in_billing_address.message);
    });

    test('firstName property in billingAddress must be string', () => {
        let payload = copyObj(dummyData);
        payload.billingAddress.firstName = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.firstName_in_billing_address.message);
    });

    test('billingAddress must have lastName property', () => {
        let payload = copyObj(dummyData);
        delete payload.billingAddress.lastName;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.lastName_in_billing_address.message);
    });

    test('lastName property in billingAddress must be string', () => {
        let payload = copyObj(dummyData);
        payload.billingAddress.lastName = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.lastName_in_billing_address.message);
    });

    test('mobileNumber property in billingAddress must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.billingAddress.mobileNumber = 6151515;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.mobileNumber_in_billing_address.message);
    });

    test('billingAddress must have postalCode property', () => {
        let payload = copyObj(dummyData);
        delete payload.billingAddress.postalCode;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.postalCode_in_billing_address.message);
    });

    test('postalCode property in billingAddress must be string', () => {
        let payload = copyObj(dummyData);
        payload.billingAddress.postalCode = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.postalCode_in_billing_address.message);
    });

    test('billingAddress must have houseNumber property', () => {
        let payload = copyObj(dummyData);
        delete payload.billingAddress.houseNumber;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errros.typeErrors.houseNumber_in_billing_address.message);
    });

    test('houseNumber property in billingAddress must be string', () => {
        let payload = copyObj(dummyData);
        payload.billingAddress.houseNumber = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.houseNumber_in_billing_address.message);
    });

    test('houseNumberAdd property in billingAddress must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.billingAddress.houseNumberAdd = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.houseNumberAdd_in_billing_address.message);
    });

    test('billingAddress must have streetName property', () => {
        let payload = copyObj(dummyData);
        delete payload.billingAddress.streetName;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.streetName_in_billing_address.message);
    });

    test('streetName property in billingAddress must be string', () => {
        let payload = copyObj(dummyData);
        payload.billingAddress.streetName = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.streetName_in_billing_address.message);
    });

    test('billingAddress must have country property', () => {
        let payload = copyObj(dummyData);
        delete payload.billingAddress.country;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.country_in_billing_address.message);
    });

    test('country property in billingAddress must be string', () => {
        let payload = copyObj(dummyData);
        payload.billingAddress.country = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.country_in_billing_address.message);
    });


    // type checking for shippingAddress object

    test('order object must have shippingAddress property', () => {
        let payload = copyObj(dummyData);
        delete payload.shippingAddress;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.shippingAddress.message);
    });

    test('shippingAddress must have firstName property', () => {
        let payload = copyObj(dummyData);
        delete payload.shippingAddress.firstName;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.firstName_in_shipping_address.message);
    });

    test('firstName property in shippingAddress must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippingAddress.firstName = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.firstName_in_shipping_address.message);
    });

    test('shippingAddress must have lastName property', () => {
        let payload = copyObj(dummyData);
        delete payload.shippingAddress.lastName;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.lastName_in_shipping_address.message);
    });

    test('lastName property in shippingAddress must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippingAddress.lastName = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.lastName_in_shipping_address.message);
    });

    test('mobileNumber property in shippingAddress must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.shippingAddress.mobileNumber = 6151515;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.mobileNumber_in_shipping_address.message);
    });

    test('shippingAddress must have postalCode property', () => {
        let payload = copyObj(dummyData);
        delete payload.shippingAddress.postalCode;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.postalCode_in_shipping_address.message);
    });

    test('postalCode property in shippingAddress must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippingAddress.postalCode = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.postalCode_in_shipping_address.message);
    });

    test('shippingAddress must have houseNumber property', () => {
        let payload = copyObj(dummyData);
        delete payload.shippingAddress.houseNumber;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.houseNumber_in_shipping_address.message);
    });

    test('houseNumber property in shippingAddress must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippingAddress.houseNumber = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.houseNumber_in_shipping_address.message);
    });

    test('houseNumberAdd property in shippingAddress must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.shippingAddress.houseNumberAdd = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.houseNumberAdd_in_shipping_address.message);
    });

    test('shippingAddress must have streetName property', () => {
        let payload = copyObj(dummyData);
        delete payload.shippingAddress.streetName;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.streetName_in_shipping_address.message);
    });

    test('streetName property in shippingAddress must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippingAddress.streetName = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.streetName_in_shipping_address.message);
    });

    test('shippingAddress must have country property', () => {
        let payload = copyObj(dummyData);
        delete payload.shippingAddress.country;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.country_in_shipping_address.message);
    });

    test('country property in shippingAddress must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippingAddress.country = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.country_in_shipping_address.message);
    });

    
    // type checking for isSubscription prop

    test('isSubscription property must be boolean if exist', () => {
        let payload = copyObj(dummyData);
        payload.isSubscription = 100;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errros.typeErrors.isSubscription.message);
    });

    // type checking for orderStatus object

    test('order object must have orderStatus property', () => {
        let payload = copyObj(dummyData);
        delete payload.orderStatus;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.orderStatus.message);
    });
    
    test('orderStatus property must be object', () => {
        let payload = copyObj(dummyData);
        payload.orderStatus = ['status'];

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.orderStatus.message);
    });

    test('orderStatus must have status property', () => {
        let payload = copyObj(dummyData);
        delete payload.orderStatus.status;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.status_in_orderStatus.message);
    });

    test('status property in orderStatus must be string', () => {
        let payload = copyObj(dummyData);
        payload.orderStatus.status = 100;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.status_in_orderStatus.message);
    });

    test('timestamp property in orderStatus must be date if exist', () => {
        let payload = copyObj(dummyData);
        payload.orderStatus.timestamp = 'some date';

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.timestamp_in_orderStatus.message);
    });

    // type checking for orderStatusHistory object

    test('order object must have orderStatusHistory property', () => {
        let payload = copyObj(dummyData);
        delete payload.orderStatusHistory;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.orderStatusHistory.message);
    });
    
    test('orderStatusHistory property must be array', () => {
        let payload = copyObj(dummyData);
        payload.orderStatusHistory = { data: 'data' };

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.orderStatusHistory.message);
    });

    test('item in orderStatusHistory must have status property', () => {
        let payload = copyObj(dummyData);
        delete payload.orderStatusHistory[0].status;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.status_in_orderStatusHistory.message);
    });

    test('status property in item of orderStatusHistory must be string', () => {
        let payload = copyObj(dummyData);
        payload.orderStatusHistory[0].status = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.status_in_orderStatusHistory.message);
    });

    test('timestamp property in item of orderStatusHistory must be date if exist', () => {
        let payload = copyObj(dummyData);
        payload.orderStatusHistory[0].timestamp = "some date";

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.timestamp_in_orderStatusHistory.message);
    });

    // type checking for paymentMethod object

    test('order object must have paymentMethod property', () => {
        let payload = copyObj(dummyData);
        delete payload.paymentMethod;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.paymentMethod.message);
    });

    test('paymentMethod property must be object', () => {
        let payload = copyObj(dummyData);
        payload.paymentMethod = ["some data"];

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.paymentMethod.message);
    });

    test('paymentMethod must have type property', () => {
        let payload = copyObj(dummyData);
        delete payload.paymentMethod.type;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.type_in_paymentMethod.message);
    });

    test('type property in paymentMethod must be string', () => {
        let payload = copyObj(dummyData);
        payload.paymentMethod.type = 10;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.type_in_paymentMethod.message);
    });

    test('paymentMethod must have recurringDetail property', () => {
        let payload = copyObj(dummyData);
        delete payload.paymentMethod.recurringDetail;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.recurringDetail_in_paymentMethod.message);
    });

    test('recurringDetail property in paymentMethod must be string', () => {
        let payload = copyObj(dummyData);
        payload.paymentMethod.recurringDetail = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.recurringDetail_in_paymentMethod.message);
    });

    // type checking for paymentStatus object

    test('order object must have paymentStatus property', () => {
        let payload = copyObj(dummyData);
        delete payload.paymentStatus;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.paymentStatus.message);
    });
    
    test('paymentStatus property must be object', () => {
        let payload = copyObj(dummyData);
        payload.paymentStatus = ["some data"];

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.paymentStatus.message);
    });

    test('paymentStatus must have status property', () => {
        let payload = copyObj(dummyData);
        delete payload.paymentStatus.status;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.status_in_paymentStatus.message);
    });

    test('status property in paymentStatus must be string', () => {
        let payload = copyObj(dummyData);
        payload.paymentStatus.status = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.status_in_paymentStatus.message);
    });

    test('timestamp property in paymentStatus must be date if exist', () => {
        let payload = copyObj(dummyData);
        payload.paymentStatus.timestamp = "some date";

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.timestamp_in_paymentStatus.message);
    });

    // type checking for paymentStatusHistory object

    test('order object must have paymentHistory property', () => {
        let payload = copyObj(dummyData);
        delete payload.paymentHistory;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.paymentHistory.message);
    });
    
    test('paymentHistory property must be array', () => {
        let payload = copyObj(dummyData);
        payload.paymentHistory = { key: 'value' };

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.paymentHistory.message);
    });

    test('item in paymentHistory must have status property', () => {
        let payload = copyObj(dummyData);
        delete payload.paymentHistory[0].status;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.status_in_paymentHistory.message);
    });

    test('status property in item of paymentStatusHistory must be string', () => {
        let payload = copyObj(dummyData);
        payload.paymentHistory[0].status = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.status_in_paymentHistory.message);
    });

    test('timestamp property in item of paymentStatusHistory must be date if exist', () => {
        let payload = copyObj(dummyData);
        payload.paymentHistory[0].timestamp = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.timestamp_in_paymentHistory.message);
    });

    // type checking for creationDate prop
    
    test('creationDate property must be date if exist', () => {
        let payload = copyObj(dummyData);
        payload.creationDate = "some text";

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.creationDate.message);
    });

    // type checking for deliverySchedule prop
    
    test('deliverySchedule property must be date if exist', () => {
        let payload = copyObj(dummyData);
        payload.deliverySchedule = "some date";

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.deliverySchedule.message);
    });

    // type checking for isShipped prop
    
    test('isShipped property must be boolean if exist', () => {
        let payload = copyObj(dummyData);
        payload.isShipped = "some text";

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.deliverySchedule.message);
    });

    // type checking for shippedDate prop
    
    test('shippedDate property must be date if exist', () => {
        let payload = copyObj(dummyData);
        payload.shippedDate = "some date";

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.shippedDate.message);
    });

    // type checking for courier prop
    
    test('courier property must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.courier = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.courier.message);
    });

    // type checking for trackingNumber 

    test('trackingNumber must be array if exist', () => {
        let payload = copyObj(dummyData);
        payload.trackingNumber = { tracking: "1234" };

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.trackingNumber.message);
    });

    test('item in trackingNumber must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.trackingNumber[0] = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.item_in_trackingNumber.message);
    });

    // type checking for isConfEmailDelivered

    test('isConfEmailDelivered must be boolean if exist', () => {
        let payload = copyObj(dummyData);
        payload.isConfEmailDelivered = "hey is it delivered?";

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.isConfEmailDelivered.message);
    });

    // type checking for lastModified

    test('lastModified must be date if exist', () => {
        let payload = copyObj(dummyData);
        payload.lastModified = "some date";

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.lastModified.message);
    });

    // type checking for orderAmountPerItem prop

    test('order object must have orderAmountPerItem property', ()=> {
        let payload = copyObj(dummyData);
        delete payload.orderAmountPerItem;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.orderAmountPerItem.message);
    });

    test('orderAmountPerItem must be array', () => {
        let payload = copyObj(dummyData);
        payload.orderAmountPerItem = { key: 'value' };

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.orderAmountPerItem.message);
    });

    test('item in orderAmountPerItem must have itemId property', () => {
        let payload = copyObj(dummyData);
        delete payload.orderAmountPerItem[0].itemId;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.itemId_in_orderAmountPerItem.message);
    });

    test('itemId in orderAmountPerItem must be string', () => {
        let payload = copyObj(dummyData);
        payload.orderAmountPerItem[0].itemId = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.itemId_in_orderAmountPerItem.message);
    });

    test('item in orderAmountPerItem must have name property', () => {
        let payload = copyObj(dummyData);
        delete payload.orderAmountPerItem[0].name;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.name_in_orderAmountPerItem.message);
    });

    test('name in orderAmountPerItem must be string', () => {
        let payload = copyObj(dummyData);
        payload.orderAmountPerItem[0].name = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.name_in_orderAmountPerItem.message);
    });

    test('item in orderAmountPerItem must have quantity property', () => {
        let payload = copyObj(dummyData);
        delete payload.orderAmountPerItem[0].quantity;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.quantity_in_orderAmountPerItem.message);
    });

    test('quantity in orderAmountPerItem must be number', () => {
        let payload = copyObj(dummyData);
        payload.orderAmountPerItem[0].quantity = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.quantity_in_orderAmountPerItem.message);
    });

    test('item in orderAmountPerItem must have currency property', () => {
        let payload = copyObj(dummyData);
        delete payload.orderAmountPerItem[0].currency;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.currency_in_orderAmountPerItem.message);
    });

    test('currency in orderAmountPerItem must be string', () => {
        let payload = copyObj(dummyData);
        payload.orderAmountPerItem[0].currency = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.currency_in_orderAmountPerItem.message);
    });

    test('item in orderAmountPerItem must have originalPrice property', () => {
        let payload = copyObj(dummyData);
        delete payload.orderAmountPerItem[0].originalPrice;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.originalPrice_in_orderAmountPerItem.message);
    });

    test('originalPrice in orderAmountPerItem must be string', () => {
        let payload = copyObj(dummyData);
        payload.orderAmountPerItem[0].originalPrice = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.originalPrice_in_orderAmountPerItem.message);
    });

    test('item in orderAmountPerItem must have discount property', () => {
        let payload = copyObj(dummyData);
        delete payload.orderAmountPerItem[0].discount;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.discount_in_orderAmountPerItem.message);
    });

    test('discount in orderAmountPerItem must be string', () => {
        let payload = copyObj(dummyData);
        payload.orderAmountPerItem[0].discount = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.discount_in_orderAmountPerItem.message);
    });

    test('item in orderAmountPerItem must have vat property', () => {
        let payload = copyObj(dummyData);
        delete payload.orderAmountPerItem[0].vat;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.vat_in_orderAmountPerItem.message);
    });

    test('vat in orderAmountPerItem must be string', () => {
        let payload = copyObj(dummyData);
        payload.orderAmountPerItem[0].vat = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.vat_in_orderAmountPerItem.message);
    });

    test('item in orderAmountPerItem must have grossPrice property', () => {
        let payload = copyObj(dummyData);
        delete payload.orderAmountPerItem[0].grossPrice;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.grossPrice_in_orderAmountPerItem.message);
    });

    test('grossPrice in orderAmountPerItem must be string', () => {
        let payload = copyObj(dummyData);
        payload.orderAmountPerItem[0].grossPrice = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.grossPrice_in_orderAmountPerItem.message);
    });

    test('item in orderAmountPerItem must have netPrice property', () => {
        let payload = copyObj(dummyData);
        delete payload.orderAmountPerItem[0].netPrice;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.netPrice_in_orderAmountPerItem.message);
    });

    test('netPrice in orderAmountPerItem must be string', () => {
        let payload = copyObj(dummyData);
        payload.orderAmountPerItem[0].netPrice = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.netPrice_in_orderAmountPerItem.message);
    });

    test('sumOfDiscount in orderAmountPerItem must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.orderAmountPerItem[0].sumOfDiscount = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.sumOfDiscount_in_orderAmountPerItem.message);
    });

    test('sumOfVat in orderAmountPerItem must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.orderAmountPerItem[0].sumOfVat = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.sumOfVat_in_orderAmountPerItem.message);
    });

    test('sumOfGrossPrice in orderAmountPerItem must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.orderAmountPerItem[0].sumOfGrossPrice = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.sumOfGrossPrice_in_orderAmountPerItem.message);
    });

    test('sumOfNetPrice in orderAmountPerItem must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.orderAmountPerItem[0].sumOfNetPrice = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.sumOfNetPrice_in_orderAmountPerItem.message);
    });

    // type checking for orderAmount prop

    test('orderAmount must be object if exist', () => {
        let payload = copyObj(dummyData);
        delete payload.orderAmount;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.orderAmount.message);
    });

    test('orderAmount object must have currency', () => {
        let payload = copyObj(dummyData);
        delete payload.orderAmount.currency;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.currency_in_orderAmount.message);
    });

    test('currency in orderAmount object must be string', () => {
        let payload = copyObj(dummyData);
        payload.orderAmount.currency = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.currency_in_orderAmount.message);
    });

    test('orderAmount object must have totalDiscount', () => {
        let payload = copyObj(dummyData);
        delete payload.orderAmount.totalDiscount;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.totalDiscount_in_orderAmount.message);
    });

    test('totalDiscount in orderAmount object must be string', () => {
        let payload = copyObj(dummyData);
        payload.orderAmount.totalDiscount = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.totalDiscount_in_orderAmount.message);
    });

    test('orderAmount object must have totalVat', () => {
        let payload = copyObj(dummyData);
        delete payload.orderAmount.totalVat;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.totalVat_in_orderAmount.message);
    });

    test('totalVat in orderAmount object must be string', () => {
        let payload = copyObj(dummyData);
        payload.orderAmount.totalVat = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.totalVat_in_orderAmount.message);
    });

    test('orderAmount object must have totalAmount', () => {
        let payload = copyObj(dummyData);
        delete payload.orderAmount.totalAmount;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.totalAmount_in_orderAmount.message);
    });

    test('totalAmount in orderAmount object must be string', () => {
        let payload = copyObj(dummyData);
        payload.orderAmount.totalAmount = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.totalAmount_in_orderAmount.message);
    });

    test('orderAmount object must have totalNetPrice', () => {
        let payload = copyObj(dummyData);
        delete payload.orderAmount.totalNetPrice;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.totalNetPrice_in_orderAmount.message);
    });

    test('totalNetPrice in orderAmount object must be string', () => {
        let payload = copyObj(dummyData);
        payload.orderAmount.totalNetPrice = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.totalNetPrice_in_orderAmount.message);
    });

    // type checking for shippedAmount prop

    test('shippedAmount must be object if exist', () => {
        let payload = copyObj(dummyData);
        payload.shippedAmount = ['some data'];

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.shippedAmount.message);
    });

    test('shippedAmount object must have currency', () => {
        let payload = copyObj(dummyData);
        delete payload.shippedAmount.currency;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.currency_in_shippedAmount.message);
    });

    test('currency in shippedAmount object must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippedAmount.currency = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.currency_in_shippedAmount.message);
    });

    test('shippedAmount object must have totalDiscount', () => {
        let payload = copyObj(dummyData);
        delete payload.shippedAmount.totalDiscount;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.totalDiscount_in_shippedAmount.message);
    });

    test('totalDiscount in shippedAmount object must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippedAmount.totalDiscount = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.totalDiscount_in_shippedAmount.message);
    });

    test('shippedAmount object must have totalVat', () => {
        let payload = copyObj(dummyData);
        delete payload.shippedAmount.totalVat;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.totalVat_in_shippedAmount.message);
    });

    test('totalVat in shippedAmount object must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippedAmount.totalVat = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.totalVat_in_shippedAmount.message);
    });

    test('shippedAmount object must have totalAmount', () => {
        let payload = copyObj(dummyData);
        delete payload.shippedAmount.totalAmount;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.totalAmount_in_shippedAmount.message);
    });

    test('totalAmount in shippedAmount object must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippedAmount.totalAmount = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.totalAmount_in_shippedAmount.message);
    });

    test('shippedAmount object must have totalNetPrice', () => {
        let payload = copyObj(dummyData);
        delete payload.shippedAmount.totalNetPrice;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.totalNetPrice_in_shippedAmount.message);
    });

    test('totalNetPrice in shippedAmount object must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippedAmount.totalNetPrice = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.totalNetPrice_in_shippedAmount.message);
    });

    // type checking for shippedAmountPerItem prop

    test('shippedAmountPerItem must be array if exist', () => {
        let payload = copyObj(dummyData);
        payload.shippedAmountPerItem = { key: 'value' };

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.shippedAmountPerItem.message);
    });

    test('item in shippedAmountPerItem must have itemId property', () => {
        let payload = copyObj(dummyData);
        delete payload.shippedAmountPerItem[0].itemId;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.itemId_in_shippedAmountPerItem.message);
    });

    test('itemId in shippedAmountPerItem must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippedAmountPerItem[0].itemId = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.itemId_in_shippedAmountPerItem.message);
    });

    test('item in shippedAmountPerItem must have name property', () => {
        let payload = copyObj(dummyData);
        delete payload.shippedAmountPerItem[0].name;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.name_in_shippedAmountPerItem.message);
    });

    test('name in shippedAmountPerItem must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippedAmountPerItem[0].name = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.name_in_shippedAmountPerItem.message);
    });

    test('item in shippedAmountPerItem must have quantity property', () => {
        let payload = copyObj(dummyData);
        delete payload.shippedAmountPerItem[0].quantity;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.quantity_in_shippedAmountPerItem.message);
    });

    test('quantity in shippedAmountPerItem must be number', () => {
        let payload = copyObj(dummyData);
        payload.shippedAmountPerItem[0].quantity = 'some qty';

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.quantity_in_shippedAmountPerItem.message);
    });

    test('item in shippedAmountPerItem must have currency property', () => {
        let payload = copyObj(dummyData);
        delete payload.shippedAmountPerItem[0].currency;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.currency_in_shippedAmountPerItem.message);
    });

    test('currency in shippedAmountPerItem must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippedAmountPerItem[0].currency = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.currency_in_shippedAmountPerItem.message);
    });

    test('item in shippedAmountPerItem must have originalPrice property', () => {
        let payload = copyObj(dummyData);
        delete payload.shippedAmountPerItem[0].originalPrice;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.originalPrice_in_shippedAmountPerItem.message);
    });

    test('originalPrice in shippedAmountPerItem must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippedAmountPerItem[0].originalPrice = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.originalPrice_in_shippedAmountPerItem.message);
    });

    test('item in shippedAmountPerItem must have discount property', () => {
        let payload = copyObj(dummyData);
        delete payload.shippedAmountPerItem[0].discount;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.discount_in_shippedAmountPerItem.message);
    });

    test('discount in shippedAmountPerItem must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippedAmountPerItem[0].discount = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.discount_in_shippedAmountPerItem.message);
    });

    test('item in shippedAmountPerItem must have vat property', () => {
        let payload = copyObj(dummyData);
        delete payload.shippedAmountPerItem[0].vat;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.vat_in_shippedAmountPerItem.message);
    });

    test('vat in shippedAmountPerItem must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippedAmountPerItem[0].vat = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.vat_in_shippedAmountPerItem.message);
    });

    test('item in shippedAmountPerItem must have grossPrice property', () => {
        let payload = copyObj(dummyData);
        delete payload.shippedAmountPerItem[0].grossPrice;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.grossPrice_in_shippedAmountPerItem.message);
    });

    test('grossPrice in shippedAmountPerItem must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippedAmountPerItem[0].grossPrice = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.grossPrice_in_shippedAmountPerItem.message);
    });

    test('item in shippedAmountPerItem must have netPrice property', () => {
        let payload = copyObj(dummyData);
        delete payload.shippedAmountPerItem[0].netPrice;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.netPrice_in_shippedAmountPerItem.message);
    });

    test('netPrice in shippedAmountPerItem must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippedAmountPerItem[0].netPrice = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.netPrice_in_shippedAmountPerItem.message);
    });

    test('sumOfDiscount in shippedAmountPerItem must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.shippedAmountPerItem[0].sumOfDiscount = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.sumOfDiscount_in_shippedAmountPerItem.message);
    });

    test('sumOfVat in shippedAmountPerItem must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.shippedAmountPerItem[0].sumOfVat = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.sumOfVat_in_shippedAmountPerItem.message);
    });

    test('sumOfGrossPrice in shippedAmountPerItem must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.shippedAmountPerItem[0].sumOfGrossPrice = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.sumOfGrossPrice_in_shippedAmountPerItem.message);
    });

    test('sumOfNetPrice in shippedAmountPerItem must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.shippedAmountPerItem[0].sumOfNetPrice = true;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.sumOfNetPrice_in_shippedAmountPerItem.message);
    });

    // type checking for invoiceNumber 

    test('invoiceNumber must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.invoiceNumber = 1234123;

        expect(order instanceof Error).toBe(true);
        expect(order.message).toBe(errors.typeErrors.invoiceNumber.message);
    });

});