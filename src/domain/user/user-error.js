const typeErrors = Object.freeze({
    email: new Error('User object must have email as string'),
    userId: new Error('User object must have userId as string'),
    hash: new Error('User object has invalid type at property: hash'),
    salt: new Error('User object has invalid type at property: salt'),
    pwdResetToken: new Error('User object has invalid type at property: pwdResetToken'),
    firstName: new Error('User object must have firstName as string'),
    lastName: new Error('User object must have lastName as string'),
    mobileNumber: new Error('User object has invalid type at property: mobileNumber'),
    item_in_addresses: new Error('User object has invalid type at property: item in addresses array'),
    defaultShippingAddress: new Error('User object has invalid type at property: defaultShippingAddress'),
    defaultBillingAddress: new Error('User object has invalid type at property: defaultBillingAddress'),
    item_in_billingOptions: new Error('User object has invalid type at property: item in billingOptions array'),
    item_in_subscriptions: new Error('User object has invalid type at property: item in subscriptions array'),
    item_in_orders: new Error('User object has invalid type at property: item in orders array'),
    creationDate: new Error('User object has invalid type at property: creationDate'),
    lastModified: new Error('User object has invalid type at property: lastModified'),
    lastLogin: new Error('User object has invalid type at property: lastLogin'),
    isEmailVerified: new Error('User object has invalid type at property: isEmailVerified'),
    newsletterOptin: new Error('User object has invalid type at property: newsletterOptin'),
});

const genericErrors = Object.freeze({

});

module.exports = {
    typeErrors: typeErrors,
    genericErrors: genericErrors
};