const typeErrors = Object.freeze({
    user_id: new Error('Billing object must have user_id property as string'),
    type: new Error('Billing object must have type property as string'),
    recurringDetail: new Error('Billing object has invalid type at property: recurringDetail'),
    billingId: new Error('Billing object must have billingId property as string'),
    tokenRefundStatus: new Error('Billing object has invalid type at property: tokenRefundStatus'),
    creationDate: new Error('Billing object has invalid type at property: creationDate'),
    lastModified: new Error('Billing object has invalid type at property: lastModified')
});

const genericErrors = Object.freeze({
    invalid_token_refund_status: new Error('Billing object contain invalid token refund status: please check your input')
})

module.exports = {
    typeErrors: typeErrors,
    genericErrors: genericErrors
};