const buildSerializer = require('../../_shared/serializerBuilder');

const _serializeItemObj = (itemObj) => {
    return {
        itemId: itemObj.itemId,
        name: itemObj.name,
        quantity: itemObj.quantity,
        currency: itemObj.currency,
        originalPrice: itemObj.originalPrice,
        discount: itemObj.discount,
        vat: itemObj.vat,
        grossPrice: itemObj.grossPrice,
        netPrice: itemObj.netPrice,
        sumOfDiscount: itemObj.sumOfDiscount,
        sumOfVat: itemObj.sumOfVat,
        sumOfGrossPrice: itemObj.sumOfGrossPrice,
        sumOfNetPrice: itemObj.sumOfNetPrice
    };
};

const _mapLineItemsArray = (arr) => {
    let mappedArray = [];

    arr.forEach(item => {
        mappedArray.push(_serializeItemObj(item));
    });
    return mappedArray;
};

const _serializeTotalPriceObj = (orderAmountObj) => {
    return {
        currency: orderAmountObj.currency,
        totalDiscount: orderAmountObj.totalDiscount,
        totalVat: orderAmountObj.totalVat,
        totalAmount: orderAmountObj.totalAmount,
        totalNetPrice: orderAmountObj.totalNetPrice
    };
};

const _serializeAddressObj = (address) => {
    return {
        firstName: address.firstName,
        lastName: address.lastName,
        mobileNumber: address.mobileNumber,
        postalCode: address.postalCode,
        houseNumber: address.houseNumber,
        houseNumberAdd: address.houseNumberAdd,
        streetName: address.streetName,
        country: address.country
    };
}

const _serializeShippingInfo = (shippingInfo) => {
    return {
        shippingMethod: shippingInfo.shippingMethod,
        price: {
            currency: shippingInfo.price.currency,
            amount: shippingInfo.price.amount
        }
    };
};

const _serializePaymentInfo = (paymentInfo) => {
    return {
        paymentMethodType: paymentInfo.paymentMethodType,
        paymentId: paymentInfo.paymentId
    };
};

const _serializeSingleObjEntry = (cart) => {
    console.log(cart.shippingInfo.price.amount);
    return {
        _id: cart._id,
        country: cart.country,
        cartState: cart.cartState,
        user_id: (cart.user_id)? cart.user_id: null,
        anonymous_id: (cart.anonymous_id)? cart.anonymous_id: null,
        isSubscription: cart.isSubscription,
        lineItems: _mapLineItemsArray(cart.lineItems),
        totalPrice: (cart.totalPrice)? _serializeTotalPriceObj(cart.totalPrice) : null,
        billingAddress: (cart.billingAddress)? _serializeAddressObj(cart.billingAddress) : null,
        shippingAddress: (cart.shippingAddress)? _serializeAddressObj(cart.shippingAddress) : null,
        shippingInfo: (cart.shippingInfo)? _serializeShippingInfo(cart.shippingInfo) : null,
        paymentInfo: (cart.paymentInfo)? _serializePaymentInfo(cart.paymentInfo) : null
    };
};

module.exports = buildSerializer(_serializeSingleObjEntry);