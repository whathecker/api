const buildSerializer = require('../../_shared/serializerBuilder');

const _serializeSingleObjEntry = (billing) => {
    return {
        _id: billing._id,
        user_id: billing.user_id,
        type: billing.type,
        recurringDetail: (billing.recurringDetail)? billing.recurringDetail : null,
        billingId: billing.billingId,
        tokenRefundStatus: billing.tokenRefundStatus,
        creationDate: billing.creationDate,
        lastModified: billing.lastModified
    };
}
module.exports = buildSerializer(_serializeSingleObjEntry);