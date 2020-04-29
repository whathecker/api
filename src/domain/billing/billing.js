const BillingFactory = require('./factory');

let buildCreateBillingObj = function(billingValidator) {
    return ({
        user_id,
        type,
        recurringDetail,
        billingId,
        tokenRefundStatus,
        creationDate,
        lastModified
    } = {}) => {

        const payload = {
            user_id,
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
        return new BillingFactory(payload);
    }
}

module.exports = buildCreateBillingObj;