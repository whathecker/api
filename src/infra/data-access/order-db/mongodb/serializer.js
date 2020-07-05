const buildSerializer = require('../../_shared/serializerBuilder');

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

const _serializeOrderStatusObj = (orderStatusObj) => {
    return {
        status: orderStatusObj.status,
        timestamp: orderStatusObj.timestamp
    };
}

const _mapOrderHistory = (orderStatusHistory) => {
    let mappedOrderStatusHistory = [];

    orderStatusHistory.forEach(status => {
        mappedOrderStatusHistory.push(_serializeOrderStatusObj(status));
    });

    return mappedOrderStatusHistory;
}

const _serializePaymentMethodObj = (paymentMethodObj) => {
    return {
        type: paymentMethodObj.type,
        recurringDetail: paymentMethodObj.recurringDetail
    };
}

const _serializePaymentStatusObj = (paymentStatusObj) => {
    return {
        status: paymentStatusObj.status,
        timestamp: paymentStatusObj.timestamp
    };
}

const _mapPaymentHistory = (paymentHistory) => {
    let mappedPaymentHistory = [];

    paymentHistory.forEach(history => {
        mappedPaymentHistory.push(_serializePaymentStatusObj(history));
    });

    return mappedPaymentHistory;
}

const _mapTrackingNumber = (trackingNumber) => {
    let mappedTrackingNumber = [];

    trackingNumber.forEach(number => {
        mappedTrackingNumber.push(number);
    });

    return mappedTrackingNumber;
}

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
}

const _mapAmountPerItemArray = (arr) => {
    let mappedArray = [];

    arr.forEach(item => {
        mappedArray.push(_serializeItemObj(item));
    });

    return mappedArray;
}

const _serializeOrderAmountObj = (orderAmountObj) => {
    return {
        currency: orderAmountObj.currency,
        totalDiscount: orderAmountObj.totalDiscount,
        totalVat: orderAmountObj.totalVat,
        totalAmount: orderAmountObj.totalAmount,
        totalNetPrice: orderAmountObj.totalNetPrice
    };
}

const _serializeSingleObjEntry = (order) => {
    return {
        _id: order._id,
        country: order.country,
        orderNumber: order.orderNumber,
        user_id: order.user_id,
        billingAddress: (order.billingAddress)? _serializeAddressObj(order.billingAddress) : null,
        shippingAddress: (order.shippingAddress)? _serializeAddressObj(order.shippingAddress) : null,
        isSubscription: order.isSubscription,
        orderStatus: _serializeOrderStatusObj(order.orderStatus),
        orderStatusHistory: _mapOrderHistory(order.orderStatusHistory),
        paymentMethod: _serializePaymentMethodObj(order.paymentMethod),
        paymentStatus: _serializePaymentStatusObj(order.paymentStatus),
        paymentHistory: _mapPaymentHistory(order.paymentHistory),
        deliverySchedule: (order.deliverySchedule)? order.deliverySchedule : null,
        isShipped: order.isShipped,
        shippedDate: (order.shippedDate)? order.shippedDate : null,
        deliveredDate: (order.deliveredDate)? order.deliveredDate : null,
        courier: (order.courier)? order.courier : null,
        trackingNumber: (order.trackingNumber)? _mapTrackingNumber(order.trackingNumber) : null,
        isConfEmailDelivered: order.isConfEmailDelivered,
        orderAmountPerItem: _mapAmountPerItemArray(order.orderAmountPerItem),
        orderAmount: _serializeOrderAmountObj(order.orderAmount),
        shippedAmountPerItem: (order.shippedAmountPerItem)? _mapAmountPerItemArray(order.shippedAmountPerItem) : null,
        shippedAmount: (order.shippedAmount)? _serializeOrderAmountObj(order.shippedAmount) : null,
        invoiceNumber: (order.invoiceNumber)? order.invoiceNumber: null
    }
}

module.exports = buildSerializer(_serializeSingleObjEntry);