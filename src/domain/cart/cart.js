const CartFactory = require('./factory');

let buildCreateCheckoutObj = function (checkoutValidator) {
    return ({
        country,
        cartState,
        user_id,
        anonymous_id,
        isSubscription,
        lineItems,
        totalPrice,
        billingAddress,
        shippingAddress,
        shippingInfo,
        paymentInfo,
        creationDate,
        lastModified
    } = {}) => {

        const payload = {
            country,
            cartState,
            user_id,
            anonymous_id,
            isSubscription,
            lineItems,
            totalPrice,
            billingAddress,
            shippingAddress,
            shippingInfo,
            paymentInfo,
            creationDate,
            lastModified
        };

        const result = checkoutValidator(payload);

        if (result instanceof Error) {
            return result;
        }

        return new CartFactory(payload);
    }
}

module.exports = buildCreateCheckoutObj;