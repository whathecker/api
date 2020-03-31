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
        payload.billingAddress.mobileNumber = 06151515;

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
        payload.shippingAddress.mobileNumber = 06151515;

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

    });
    
    test('orderStatusHistory property must be array', () => {

    });

    test('item in orderStatusHistory must have status property', () => {

    });

    test('status property in item of orderStatusHistory must be string', () => {

    });

    test('timestamp property in item of orderStatusHistory must be date if exist', () => {

    });

    // type checking for paymentMethod object

    test('order object must have paymentMethod property', () => {

    });

    test('paymentMethod property must be object', () => {

    });

    test('paymentMethod must have type property', () => {

    });

    test('type property in paymentMethod must be string', () => {

    });

    test('paymentMethod must have recurringDetail property', () => {

    });

    test('recurringDetail property in paymentMethod must be string', () => {

    });

    // type checking for paymentStatus object

    test('order object must have paymentStatus property', () => {

    });
    
    test('paymentStatus property must be object', () => {

    });

    test('paymentStatus must have status property', () => {

    });

    test('status property in paymentStatus must be string', () => {

    });

    test('timestamp property in paymentStatus must be date if exist', () => {

    });

    // type checking for paymentStatusHistory object

    test('order object must have paymentStatusHistory property', () => {

    });
    
    test('paymentStatusHistory property must be array', () => {

    });

    test('item in paymentStatusHistory must have status property', () => {

    });

    test('status property in item of paymentStatusHistory must be string', () => {

    });

    test('timestamp property in item of paymentStatusHistory must be date if exist', () => {

    });

    // type checking for creationDate prop
    
    test('creationDate property must be date if exist', () => {

    });

    // type checking for deliverySchedule prop
    
    test('deliverySchedule property must be date if exist', () => {

    });

    // type checking for isShipped prop
    
    test('isShipped property must be boolean if exist', () => {

    });

    // type checking for shippedDate prop
    
    test('shippedDate property must be date if exist', () => {

    });

    // type checking for courier prop
    
    test('courier property must be string if exist', () => {

    });

    // type checking for trackingNumber 

    test('trackingNumber must be array if exist', () => {

    });

    test('item in trackingNumber must be string if exist', () => {

    });

    // type checking for isConfEmailDelivered

    test('isConfEmailDelivered must be boolean if exist', () => {

    });

    // type checking for deliveredDate

    test('deliveredDate must be date if exist', () => {

    });

    // type checking for lastModified

    test('lastModified must be date if exist', () => {

    });

    // type checking for orderAmountPerItem prop

    test('order object must have orderAmountPerItem property', ()=> {

    });

    test('orderAmountPerItem must be array', () => {

    });

    test('item in orderAmountPerItem must have itemId property', () => {

    });

    test('itemId in orderAmountPerItem must be string', () => {

    });

    test('item in orderAmountPerItem must have name property', () => {

    });

    test('name in orderAmountPerItem must be string', () => {

    });

    test('item in orderAmountPerItem must have quantity property', () => {

    });

    test('quantity in orderAmountPerItem must be number', () => {

    });

    test('item in orderAmountPerItem must have currency property', () => {

    });

    test('currency in orderAmountPerItem must be string', () => {

    });

    test('item in orderAmountPerItem must have originalPrice property', () => {

    });

    test('originalPrice in orderAmountPerItem must be string', () => {

    });

    test('item in orderAmountPerItem must have discount property', () => {

    });

    test('discount in orderAmountPerItem must be string', () => {

    });

    test('item in orderAmountPerItem must have vat property', () => {

    });

    test('vat in orderAmountPerItem must be string', () => {

    });

    test('item in orderAmountPerItem must have grossPrice property', () => {

    });

    test('grossPrice in orderAmountPerItem must be string', () => {

    });

    test('item in orderAmountPerItem must have netPrice property', () => {

    });

    test('netPrice in orderAmountPerItem must be string', () => {

    });

    test('sumOfDiscount in orderAmountPerItem must be string if exist', () => {

    });

    test('sumOfVat in orderAmountPerItem must be string if exist', () => {

    });

    test('sumOfGrossPrice in orderAmountPerItem must be string if exist', () => {

    });

    test('sumOfNetPrice in orderAmountPerItem must be string if exist', () => {

    });

    // type checking for orderAmount prop

    test('orderAmount must be object if exist', () => {

    });

    test('orderAmount object must have currency', () => {

    });

    test('currency in orderAmount object must be string', () => {

    });

    test('orderAmount object must have totalDiscount', () => {

    });

    test('totalDiscount in orderAmount object must be string', () => {

    });

    test('orderAmount object must have totalVat', () => {

    });

    test('totalVat in orderAmount object must be string', () => {

    });

    test('orderAmount object must have totalAmount', () => {

    });

    test('totalAmount in orderAmount object must be string', () => {

    });

    test('orderAmount object must have totalNetPrice', () => {

    });

    test('totalNetPrice in orderAmount object must be string', () => {

    });

    // type checking for shippedAmount prop

    test('shippedAmount must be object if exist', () => {

    });

    test('shippedAmount object must have currency', () => {

    });

    test('currency in shippedAmount object must be string', () => {

    });

    test('shippedAmount object must have totalDiscount', () => {

    });

    test('totalDiscount in shippedAmount object must be string', () => {

    });

    test('shippedAmount object must have totalVat', () => {

    });

    test('totalVat in shippedAmount object must be string', () => {

    });

    test('shippedAmount object must have totalAmount', () => {

    });

    test('totalAmount in shippedAmount object must be string', () => {

    });

    test('shippedAmount object must have totalNetPrice', () => {

    });

    test('totalNetPrice in shippedAmount object must be string', () => {

    });

    // type checking for shippedAmountPerItem prop

    test('shippedAmountPerItem must be array if exist', () => {

    });

    test('item in shippedAmountPerItem must have itemId property', () => {

    });

    test('itemId in shippedAmountPerItem must be string', () => {

    });

    test('item in shippedAmountPerItem must have name property', () => {

    });

    test('name in shippedAmountPerItem must be string', () => {

    });

    test('item in shippedAmountPerItem must have quantity property', () => {

    });

    test('quantity in shippedAmountPerItem must be number', () => {

    });

    test('item in shippedAmountPerItem must have currency property', () => {

    });

    test('currency in shippedAmountPerItem must be string', () => {

    });

    test('item in shippedAmountPerItem must have originalPrice property', () => {

    });

    test('originalPrice in shippedAmountPerItem must be string', () => {

    });

    test('item in shippedAmountPerItem must have discount property', () => {

    });

    test('discount in shippedAmountPerItem must be string', () => {

    });

    test('item in shippedAmountPerItem must have vat property', () => {

    });

    test('vat in shippedAmountPerItem must be string', () => {

    });

    test('item in shippedAmountPerItem must have grossPrice property', () => {

    });

    test('grossPrice in shippedAmountPerItem must be string', () => {

    });

    test('item in shippedAmountPerItem must have netPrice property', () => {

    });

    test('netPrice in shippedAmountPerItem must be string', () => {

    });

    test('sumOfDiscount in shippedAmountPerItem must be string if exist', () => {

    });

    test('sumOfVat in shippedAmountPerItem must be string if exist', () => {

    });

    test('sumOfGrossPrice in shippedAmountPerItem must be string if exist', () => {

    });

    test('sumOfNetPrice in shippedAmountPerItem must be string if exist', () => {

    });

    // type checking for invoiceNumber 

    test('invoiceNumber must be string if exist', () => {

    });



});