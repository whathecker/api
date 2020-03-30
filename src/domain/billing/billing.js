let buildCreateBillingObj = function(billingValidator) {
    return ({
        user,
        type,
        recurringDetail,
        billingId,
        tokenRefundStatus,
        creationDate,
        lastModified
    } = {}) => {

        const payload = {
            user,
            type,
            recurringDetail,
            billingId,
            tokenRefundStatus,
            creationDate,
            lastModified
        };

        const result = billingValidator(payload);

        if (result instanceof Error) {
            return result;
        }
        return "return object here";
    }
}

module.exports = buildCreateBillingObj;