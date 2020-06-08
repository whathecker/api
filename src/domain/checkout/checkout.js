let buildCreateCheckoutObj = function (checkoutValidator) {
    return ({
        country,
        checkoutState,
        user_id,
        anonymous_id,
        isSubscription,
        lineItems,
        totalPrice,
        billingAddress,
        shippingAddress,
        shippingInfo,
        paymentInfo
    } = {}) => {

        const paylaod = {
            country,
            checkoutState,
            user_id,
            anonymous_id,
            isSubscription,
            lineItems,
            totalPrice,
            billingAddress,
            shippingAddress,
            shippingInfo,
            paymentInfo
        };

        const result = checkoutValidator(paylaod);

        if (result instanceof Error) {
            return result;
        }

        return 'create checkout object here'
    }
}

module.exports = buildCreateCheckoutObj;