const buildSerializer = require('../../_shared/serializerBuilder');

const _convertToJsArray = (array) => {
    let mapped = [];

    array.forEach(element => mapped.push(element));

    return mapped;
}

const _serializeSingleObjEntry = (user) => {
    return {
        _id: user._id,
        email: user.email,
        userId: user.userId,
        hash: user.hash,
        salt: user.salt,
        pwdResetToken: (user.pwdResetToken)? user.pwdResetToken : null,
        firstName: user.firstName,
        lastName: user.lastName,
        mobileNumber: (user.mobileNumber)? user.mobileNumber : null,
        addresses: (user.addresses)? _convertToJsArray(user.addresses) : [],
        defaultShippingAddress: (user.defaultShippingAddress)? user.defaultShippingAddress : null,
        defaultBillingAddress: (user.defaultBillingAddress)? user.defaultBillingAddress : null,
        defaultBillingOption: (user.defaultBillingOption)? user.defaultBillingOption : null,
        billingOptions: (user.billingOptions)? _convertToJsArray(user.billingOptions) : [],
        subscriptions: (user.subscriptions)? _convertToJsArray(user.subscriptions) : [],
        orders: (user.orders)? _convertToJsArray(user.orders) : [],
        creationDate: user.creationDate,
        lastModified: user.lastModified,
        lastLogin: (user.lastLogin)? user.lastLogin : null,
        isEmailVerified: user.isEmailVerified,
        newsletterOptin: user.newsletterOptin
    };
};

module.exports = buildSerializer(_serializeSingleObjEntry);