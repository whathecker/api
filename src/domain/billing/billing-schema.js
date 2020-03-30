const Joi = require('@hapi/joi');
const errors = require('./billing-error');

module.exports = Joi.object({
    user: Joi.string().required().error(errors.typeErrors.user),
    type: Joi.string().required().error(errors.typeErrors.type),
    recurringDetail: Joi.string().error(errors.typeErrors.recurringDetail),
    billingId: Joi.string().required().error(errors.typeErrors.billingId),
    tokenRefundStatus: Joi.string().error(errors.typeErrors.tokenRefundStatus),
    creationDate: Joi.date().error(errors.typeErrors.creationDate),
    lastModified: Joi.date().error(errors.typeErrors.lastModified)
});