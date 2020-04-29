const errors = require('../billing-error');

const enum_token_refund_status = Object.freeze({
    0: "NOT_REQUIRED",
    1: "REQUIRED",
    2: "REFUNDED"
});

class BillingFactory {
    constructor({
        user_id,
        type,
        recurringDetail,
        billingId,
        tokenRefundStatus,
        creationDate,
        lastModified
    } = {}) {

        if (tokenRefundStatus) {

            const result = BillingFactory.validateTokenRefundStatus(tokenRefundStatus);

            if (!result) {
                return errors.genericErrors.invalid_token_refund_status;
            }
            
        }
        

        const payload = {
            user_id,
            type,
            recurringDetail,
            billingId,
            tokenRefundStatus,
            creationDate,
            lastModified
        };

        return new Billing(payload);
    }

    static validateTokenRefundStatus (status) {
        let result = false;

        for (let prop of Object.keys(enum_token_refund_status)) {
            if (status === enum_token_refund_status[prop]) {
                result = true;
                break;
            }
        }
        return result;
    }
}

class Billing {
    constructor({
        user_id,
        type,
        recurringDetail,
        billingId,
        tokenRefundStatus,
        creationDate,
        lastModified
    } = {}) {
        this.user_id = user_id;
        this.type = type;
        this.billingId = billingId;

        (recurringDetail)? this.recurringDetail = recurringDetail: null;
        (tokenRefundStatus)? this.tokenRefundStatus = tokenRefundStatus: null;
        (creationDate)? this.creationDate = creationDate: null;
        (lastModified)? this.lastModified = lastModified: null;
    }
}

module.exports = BillingFactory;