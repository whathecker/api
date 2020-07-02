const CartFactory = require('./factory');

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

        const payload = {
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

        const result = checkoutValidator(payload);

        if (result instanceof Error) {
            return result;
        }

        return new CartFactory(payload);
    }
}

module.exports = buildCreateCheckoutObj;