const errors = require('./checkout-error');
const buildCreateCheckoutObj = require('./checkout');
const checkoutSchema = require('./checkout-schema');
const validator = require('../_shared/validator')(checkoutSchema);
const createCheckoutObj = buildCreateCheckoutObj(validator);

const dummyData = {
    country: "NL",
    checkoutState: "ACTIVE",
    user_id: "user_id",
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
    //discountInfo: {},
    //taxInfo: {},
};

function copyObj(obj) {
    return JSON.parse(JSON.stringify(obj));
}

describe('Make checkout object', () => {

    test('checkout is created - without optional fields', () => {
        let payload = {};
        payload.country = "NL";
        payload.checkoutState = "ORDERED";

        const checkout = createCheckoutObj(payload);
        
        expect(checkout.country).toBe(payload.country);
        expect(checkout.checkoutState).toBe(payload.checkoutState);
    });

    test('checkout is created - with all fields', () => {
        const checkout = createCheckoutObj(dummyData);

        expect(checkout.country).toBe(dummyData.country);
        expect(checkout.checkoutState).toBe(dummyData.checkoutState);
        expect(checkout.user_id).toBe(dummyData.user_id);
        expect(checkout.isSubscription).toBe(dummyData.isSubscription);
        expect(checkout.lineItems).toBe(dummyData.lineItems);
        expect(checkout.totalPrice).toBe(dummyData.totalPrice);
        expect(checkout.billingAddress).toBe(dummyData.billingAddress);
        expect(checkout.shippingAddress).toBe(dummyData.shippingAddress);
        expect(checkout.shippingInfo).toBe(dummyData.shippingInfo);
        expect(checkout.paymentInfo).toBe(dummyData.paymentInfo);
    });

    test('checkout must have annoymous_id when both user_id and annoymous_id is not given', () => {
        let payload = {};
        payload.country = "NL";
        payload.checkoutState = "ORDERED";

        const checkout = createCheckoutObj(payload);
        
        expect(checkout.anonymous_id).not.toBe(null);
        expect(checkout.anonymous_id).not.toBe(undefined);
    });

    test('checkout must have default checkoutState when value is not given in payload', () => {
        let payload = copyObj(dummyData);
        delete payload.checkoutState;

        const checkout = createCheckoutObj(payload);
        expect(checkout.checkoutState).toBe("ACTIVE");
    });

    test('invalid checkoutState', () => {
        let payload = copyObj(dummyData);
        payload.checkoutState = "invalid_state";

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.genericErrors.invalid_checkout_status.message);
    });

    test('checkout cannot contain both user_id and anonymous_id', () => {
        let payload = copyObj(dummyData);
        payload.anonymous_id = "anonymous_id";

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.genericErrors.conflict_ownership.message);
    });

    test('invalid currency in item of lineItems', () => {
        let payload = copyObj(dummyData);
        payload.lineItems[0].currency = 'usd';
        
        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.genericErrors.invalid_currency_in_lineItems.message); 
    });

    test('invalid quantity in item of lineItems', () => {
        let payload = copyObj(dummyData);
        payload.lineItems[0].quantity = 0;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.genericErrors.invalid_quantity_in_lineItems.message);
    });

    test('invalid grossPrice in item of lineItems', () => {
        let payload = copyObj(dummyData);
        payload.lineItems[0].originalPrice = "1.00";

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.genericErrors.invalid_grossPrice_in_lineItems.message);
    });

    test('invalid netPrice in item of lineItems', () => {
        let payload = copyObj(dummyData);
        payload.lineItems[0].netPrice = "1.00";

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.genericErrors.invalid_netPrice_in_lineItems.message);
    });

    test('invalid sumOfGrossPrice in item of lineItems', () => {
        let payload = copyObj(dummyData);
        payload.lineItems[0].sumOfGrossPrice = "1.00";

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.genericErrors.invalid_sumOfGrossPrice_in_lineItems.message);
    });

    test('invalid sumOfNetPrice in item of lineItems', () => {
        let payload = copyObj(dummyData);
        payload.lineItems[0].sumOfNetPrice = "1.00";

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.genericErrors.invalid_sumOfNetPrice_in_lineItems.message);
    });

    test('invalid sumOfVat in item of lineItems', () => {
        let payload = copyObj(dummyData);
        payload.lineItems[0].sumOfVat = "1.00";

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.genericErrors.invalid_sumOfVat_in_lineItems.message);
    });

    test('invalid sumOfDiscount in item of lineItems', () => {
        let payload = copyObj(dummyData);
        payload.lineItems[0].sumOfDiscount = "1.00";

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.genericErrors.invalid_sumOfDiscount_in_lineItems.message);
    });

    test('invalid shippingMethod', () => {
        let payload = copyObj(dummyData);
        payload.shippingInfo.shippingMethod = "invalid value";

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.genericErrors.invalid_shippingMethod.message);
    });


});

describe('Type checking: checkout object', () => {

    test('checkout object must have a country property', () => {
        let payload = copyObj(dummyData);
        delete payload.country;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.country.message);
    });

    test('country property must be string', () => {
        let payload = copyObj(dummyData);
        payload.country = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.country.message);
    });

    test('checkoutState must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.checkoutState = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.checkoutState.message);
    });

    test('user_id property must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.user_id = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.user_id.message);
    });

    test('anonymous_id must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.anonymous_id = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.anonymous_id.message);
    });

    test('isSubscription must be boolean if exist', () => {
        let payload = copyObj(dummyData);
        payload.isSubscription = "some string";
        
        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.isSubscription.message);
    });

    // type checking for lineItems prop

    test('item in lineItems array must have itemId property', () => {
        let payload = copyObj(dummyData);
        delete payload.lineItems[0].itemId;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.itemId_in_lineItems.message);
    });

    test('itemId in lineItems array must be string', () => {
        let payload = copyObj(dummyData);
        payload.lineItems[0].itemId = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.itemId_in_lineItems.message);
    });

    test('item in lineItems array must have name property', () => {
        let payload = copyObj(dummyData);
        delete payload.lineItems[0].name;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.name_in_lineItems.message);
    });

    test('name in lineItems array must be string', () => {
        let payload = copyObj(dummyData);
        payload.lineItems[0].name = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.name_in_lineItems.message);
    });

    test('item in lineItems array must have currency property', () => {
        let payload = copyObj(dummyData);
        delete payload.lineItems[0].currency;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.currency_in_lineItems.message);
    });

    test('currency in lineItems array must be string', () => {
        let payload = copyObj(dummyData);
        payload.lineItems[0].currency = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.currency_in_lineItems.message);
    });

    test('item in lineItems array must have quantity property', () => {
        let payload = copyObj(dummyData);
        delete payload.lineItems[0].quantity;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.quantity_in_lineItems.message);
    });

    test('quantity in lineItems array must be number', () => {
        let payload = copyObj(dummyData);
        payload.lineItems[0].quantity = "some text";

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.quantity_in_lineItems.message);
    });

    test('item in lineItems array must have originalPrice property', () => {
        let payload = copyObj(dummyData);
        delete payload.lineItems[0].originalPrice;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.originalPrice_in_lineItems.message);
    });

    test('originalPrice in lineItems array must be string', () => {
        let payload = copyObj(dummyData);
        payload.lineItems[0].originalPrice = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.originalPrice_in_lineItems.message);
    });

    test('item in lineItems array must have discount property', () => {
        let payload = copyObj(dummyData);
        delete payload.lineItems[0].discount;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.discount_in_lineItems.message);
    });

    test('discount in lineItems array must be string', () => {
        let payload = copyObj(dummyData);
        payload.lineItems[0].discount = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.discount_in_lineItems.message);
    });

    test('item in lineItems array must have vat property', () => {
        let payload = copyObj(dummyData);
        delete payload.lineItems[0].vat;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.vat_in_lineItems.message);
    });

    test('vat in lineItems array must be string', () => {
        let payload = copyObj(dummyData);
        payload.lineItems[0].vat = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.vat_in_lineItems.message);
    });

    test('item in lineItems array must have grossPrice property', () => {
        let payload = copyObj(dummyData);
        delete payload.lineItems[0].grossPrice;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.grossPrice_in_lineItems.message);
    });

    test('grossPrice in lineItems array must be string', () => {
        let payload = copyObj(dummyData);
        payload.lineItems[0].grossPrice = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.grossPrice_in_lineItems.message);
    });

    test('item in lineItems array must have netPrice property', () => {
        let payload = copyObj(dummyData);
        delete payload.lineItems[0].netPrice;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.netPrice_in_lineItems.message);
    });

    test('netPrice in lineItems array must be string', () => {
        let payload = copyObj(dummyData);
        payload.lineItems[0].netPrice = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.netPrice_in_lineItems.message);
    });

    test('item in lineItems array must have sumOfGrossPrice property', () => {
        let payload = copyObj(dummyData);
        delete payload.lineItems[0].sumOfGrossPrice;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.sumOfGrossPrice_in_lineItems.message);
    });

    test('sumOfGrossPrice in lineItems array must be string', () => {
        let payload = copyObj(dummyData);
        payload.lineItems[0].sumOfGrossPrice = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.sumOfGrossPrice_in_lineItems.message);
    });

    test('item in lineItems array must have sumOfNetPrice property', () => {
        let payload = copyObj(dummyData);
        delete payload.lineItems[0].sumOfNetPrice;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.sumOfNetPrice_in_lineItems.message);
    });

    test('sumOfNetPrice in lineItems array must be string', () => {
        let payload = copyObj(dummyData);
        payload.lineItems[0].sumOfNetPrice = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.sumOfNetPrice_in_lineItems.message);
    });

    test('item in lineItems array must have sumOfVat property', () => {
        let payload = copyObj(dummyData);
        delete payload.lineItems[0].sumOfVat;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.sumOfVat_in_lineItems.message);
    });

    test('sumOfVat in lineItems array must be string', () => {
        let payload = copyObj(dummyData);
        payload.lineItems[0].sumOfVat = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.sumOfVat_in_lineItems.message);
    });

    test('item in lineItems array must have sumOfDiscount property', () => {
        let payload = copyObj(dummyData);
        delete payload.lineItems[0].sumOfDiscount;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.sumOfDiscount_in_lineItems.message);
    });

    test('sumOfDiscount in lineItems array must be string', () => {
        let payload = copyObj(dummyData);
        payload.lineItems[0].sumOfDiscount = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.sumOfDiscount_in_lineItems.message);
    });

    // type checking for totalPrice object
    test('totalPrice object must have currency property', () => {
        let payload = copyObj(dummyData);
        delete payload.totalPrice.currency;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.currency_in_totalPrice.message);
    });

    test('currency in totalPrice object must be string', () => {
        let payload = copyObj(dummyData);
        payload.totalPrice.currency = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.currency_in_totalPrice.message);
    });

    test('totalPrice object must have totalAmount property', () => {
        let payload = copyObj(dummyData);
        delete payload.totalPrice.totalAmount;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.totalAmount_in_totalPrice.message);
    });

    test('totalAmount in totalPrice object must be string', () => {
        let payload = copyObj(dummyData);
        payload.totalPrice.totalAmount = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.totalAmount_in_totalPrice.message);
    });

    test('totalPrice object must have totalDiscount property', () => {
        let payload = copyObj(dummyData);
        delete payload.totalPrice.totalDiscount;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.totalDiscount_in_totalPrice.message);
    });

    test('totalDiscount in totalPrice object must be string', () => {
        let payload = copyObj(dummyData);
        payload.totalPrice.totalDiscount = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.totalDiscount_in_totalPrice.message);
    });

    test('totalPrice object must have totalVat property', () => {
        let payload = copyObj(dummyData);
        delete payload.totalPrice.totalVat;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.totalVat_in_totalPrice.message);
    });

    test('totalVat in totalPrice object must be string', () => {
        let payload = copyObj(dummyData);
        payload.totalPrice.totalVat = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.totalVat_in_totalPrice.message);
    });

    test('totalPrice object must have totalNetPrice property', () => {
        let payload = copyObj(dummyData);
        delete payload.totalPrice.totalNetPrice;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.totalNetPrice_in_totalPrice.message);
    });

    test('totalNetPrice in totalPrice object must be string', () => {
        let payload = copyObj(dummyData);
        payload.totalPrice.totalNetPrice = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.totalNetPrice_in_totalPrice.message);
    });

    // type checking for billingAddress

    test('billingAddress object must have firstName property', () => {
        let payload = copyObj(dummyData);
        delete payload.billingAddress.firstName;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.firstName_in_billingAddress.message);
    });

    test('firstName in billingAddress object must be string', () => {
        let payload = copyObj(dummyData);
        payload.billingAddress.firstName = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.firstName_in_billingAddress.message);
    });

    test('billingAddress object must have lastName property', () => {
        let payload = copyObj(dummyData);
        delete payload.billingAddress.lastName;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.lastName_in_billingAddress.message);
    });

    test('lastName in billingAddress object must be string', () => {
        let payload = copyObj(dummyData);
        payload.billingAddress.lastName = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.lastName_in_billingAddress.message);
    });

    test('mobileNumber prop in billingAddress must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.billingAddress.mobileNumber = true;
        
        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.mobileNumber_in_billingAddress.message);
    });

    test('billingAddress object must have postalCode property', () => {
        let payload = copyObj(dummyData);
        delete payload.billingAddress.postalCode;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.postalCode_in_billingAddress.message);
    });

    test('postalCode in billingAddress object must be string', () => {
        let payload = copyObj(dummyData);
        payload.billingAddress.postalCode = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.postalCode_in_billingAddress.message);
    });

    test('billingAddress object must have houseNumber property', () => {
        let payload = copyObj(dummyData);
        delete payload.billingAddress.houseNumber;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.houseNumber_in_billingAddress.message);
    });

    test('houseNumber in billingAddress object must be string', () => {
        let payload = copyObj(dummyData);
        payload.billingAddress.houseNumber = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.houseNumber_in_billingAddress.message);
    });

    test('houseNumberAdd prop in billingAddress must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.billingAddress.houseNumberAdd = true;
        
        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.houseNumberAdd_in_billingAddress.message);
    });

    test('billingAddress object must have streetName property', () => {
        let payload = copyObj(dummyData);
        delete payload.billingAddress.streetName;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.streetName_in_billingAddress.message);
    });

    test('streetName in billingAddress object must be string', () => {
        let payload = copyObj(dummyData);
        payload.billingAddress.streetName = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.streetName_in_billingAddress.message);
    });

    test('billingAddress object must have country property', () => {
        let payload = copyObj(dummyData);
        delete payload.billingAddress.country;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.country_in_billingAddress.message);
    });

    test('country in billingAddress object must be string', () => {
        let payload = copyObj(dummyData);
        payload.billingAddress.country = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.country_in_billingAddress.message);
    });

    // type checking for shippingAddress

    test('shippingAddress object must have firstName property', () => {
        let payload = copyObj(dummyData);
        delete payload.shippingAddress.firstName;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.firstName_in_shippingAddress.message);
    });

    test('firstName in shippingAddress object must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippingAddress.firstName = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.firstName_in_shippingAddress.message);
    });

    test('shippingAddress object must have lastName property', () => {
        let payload = copyObj(dummyData);
        delete payload.shippingAddress.lastName;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.lastName_in_shippingAddress.message);
    });

    test('lastName in shippingAddress object must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippingAddress.lastName = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.lastName_in_shippingAddress.message);
    });

    test('mobileNumber prop in shippingAddress must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.shippingAddress.mobileNumber = true;
        
        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.mobileNumber_in_shippingAddress.message);
    });

    test('shippingAddress object must have postalCode property', () => {
        let payload = copyObj(dummyData);
        delete payload.shippingAddress.postalCode;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.postalCode_in_shippingAddress.message);
    });

    test('postalCode in shippingAddress object must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippingAddress.postalCode = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.postalCode_in_shippingAddress.message);
    });

    test('shippingAddress object must have houseNumber property', () => {
        let payload = copyObj(dummyData);
        delete payload.shippingAddress.houseNumber;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.houseNumber_in_shippingAddress.message);
    });

    test('houseNumber in shippingAddress object must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippingAddress.houseNumber = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.houseNumber_in_shippingAddress.message);
    });

    test('houseNumberAdd prop in shippingAddress must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.shippingAddress.houseNumberAdd = true;
        
        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.houseNumberAdd_in_shippingAddress.message);
    });

    test('shippingAddress object must have streetName property', () => {
        let payload = copyObj(dummyData);
        delete payload.shippingAddress.streetName;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.streetName_in_shippingAddress.message);
    });

    test('streetName in shippingAddress object must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippingAddress.streetName = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.streetName_in_shippingAddress.message);
    });

    test('shippingAddress object must have country property', () => {
        let payload = copyObj(dummyData);
        delete payload.shippingAddress.country;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.country_in_shippingAddress.message);
    });

    test('country in shippingAddress object must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippingAddress.country = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.country_in_shippingAddress.message);
    });

    // type checking for shippingInfo

    test('shippingInfo object must have shippingMethod property', () => {
        let payload = copyObj(dummyData);
        delete payload.shippingInfo.shippingMethod;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.shippingMethod_in_shippingInfo.message);
    });

    test('shippingMethod in shippingInfo object must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippingInfo.shippingMethod = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.shippingMethod_in_shippingInfo.message);
    });

    test('shippingInfo object must have currency property in price', () => {
        let payload = copyObj(dummyData);
        delete payload.shippingInfo.price.currency;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.currency_in_shippingInfo.message);
    });

    test('currency in price of shippingInfo object must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippingInfo.price.currency = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.currency_in_shippingInfo.message);
    });

    test('shippingInfo object must have amount property in price', () => {
        let payload = copyObj(dummyData);
        delete payload.shippingInfo.price.amount;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.amount_in_shippingInfo.message);
    });

    test('amount in price of shippingInfo object must be string', () => {
        let payload = copyObj(dummyData);
        payload.shippingInfo.price.amount = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.amount_in_shippingInfo.message);
    });

    // type checking paymentInfo object

    test('paymentInfo object must have amount paymentMethodType in price', () => {
        let payload = copyObj(dummyData);
        delete payload.paymentInfo.paymentMethodType;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.paymentMethodType_in_paymentInfo.message);
    });

    test('paymentMethodType in paymentInfo object must be string', () => {
        let payload = copyObj(dummyData);
        payload.paymentInfo.paymentMethodType = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.paymentMethodType_in_paymentInfo.message);
    });

    test('paymentInfo object must have amount paymentId in price', () => {
        let payload = copyObj(dummyData);
        delete payload.paymentInfo.paymentId;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.paymentId_in_paymentInfo.message);
    });

    test('paymentId in paymentInfo object must be string', () => {
        let payload = copyObj(dummyData);
        payload.paymentInfo.paymentId = true;

        const checkout = createCheckoutObj(payload);

        expect(checkout instanceof Error).toBe(true);
        expect(checkout.message).toBe(errors.typeErrors.paymentId_in_paymentInfo.message);
    });

});
