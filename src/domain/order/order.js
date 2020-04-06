const OrderFactory = require('./factory');

let buildCreateOrderObj = function(orderValidator) {
    return ({
        orderNumber,
        user,
        invoiceNumber,
        billingAddress,
        shippingAddress,
        isSubscription,
        orderStatus,
        orderStatusHistory,
        paymentMethod,
        paymentStatus,
        paymentHistory,
        deliverySchedule,
        isShipped,
        shippedDate,
        courier,
        trackingNumber,
        isConfEmailDelivered,
        orderAmountPerItem,
        orderAmount,
        shippedAmountPerItem,
        shippedAmount,
        creationDate,
        lastModified
    } = {}) => {

        const payload = {
            orderNumber,
            user,
            invoiceNumber,
            billingAddress,
            shippingAddress,
            isSubscription,
            orderStatus,
            orderStatusHistory,
            paymentMethod,
            paymentStatus,
            paymentHistory,
            deliverySchedule,
            isShipped,
            shippedDate,
            courier,
            trackingNumber,
            isConfEmailDelivered,
            orderAmountPerItem,
            orderAmount,
            shippedAmountPerItem,
            shippedAmount,
            creationDate,
            lastModified
        };
        
        const result = orderValidator(payload);

        if (result instanceof Error) {
            return result;
        }
        return new OrderFactory(payload);
    }
}

module.exports = buildCreateOrderObj;