const UserFactory = require('./factory');

let buildCreateUserObj = function (userValidator) {
    return ({
        email,
        userId,
        hash,
        salt,
        pwdResetToken,
        firstName,
        lastName,
        mobileNumber,
        addresses,
        defaultShippingAddress,
        defaultBillingAddress,
        billingOptions,
        subscriptions,
        orders,
        creationDate,
        lastModified,
        lastLogin,
        isEmailVerified,
        newsletterOptin
    } = {}) => {

        const payload = {
            email,
            userId,
            hash,
            salt,
            pwdResetToken,
            firstName,
            lastName,
            mobileNumber,
            addresses,
            defaultShippingAddress,
            defaultBillingAddress,
            billingOptions,
            subscriptions,
            orders,
            creationDate,
            lastModified,
            lastLogin,
            isEmailVerified,
            newsletterOptin
        };

        const result = userValidator(payload);

        if (result instanceof Error) {
            return result;
        }

        return new UserFactory(payload);
    };
}

module.exports = buildCreateUserObj;