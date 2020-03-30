const typeErrors = Object.freeze({
    user: new Error('Billing object must have user property as string'),
    type: new Error('Billing object must have type property as string'),
    recurringDetail: new Error('Billing object has invalid type at property: recurringDetail'),
    billingId: new Error('Billing object must have billingId property as string'),
    tokenRefundStatus: new Error('Billing object has invalid type at property: tokenRefundStatus'),
    creationDate: new Error('Billing object has invalid type at property: creationDate'),
    lastModified: new Error('Billing object has invalid type at property: lastModified')
});

module.exports = {
    typeErrors: typeErrors
};