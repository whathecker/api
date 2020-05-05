const errors = require('./user-error');
const Joi = require('@hapi/joi');

module.exports = Joi.object({
    email: Joi.string().required().error(errors.typeErrors.email),
    userId: Joi.string().required().error(errors.typeErrors.userId),
    hash: Joi.string().error(errors.typeErrors.hash),
    salt: Joi.string().error(errors.typeErrors.salt),
    pwdResetToken: Joi.string().error(errors.typeErrors.pwdResetToken),
    firstName: Joi.string().required().error(errors.typeErrors.firstName),
    lastName: Joi.string().required().error(errors.typeErrors.lastName),
    mobileNumber: Joi.string().error(errors.typeErrors.mobileNumber),
    addresses: Joi.array().items(
        Joi.string().error(errors.typeErrors.item_in_addresses),
    ),
    defaultShippingAddress: Joi.string().error(errors.typeErrors.defaultShippingAddress),
    defaultBillingAddress: Joi.string().error(errors.typeErrors.defaultBillingAddress),
    defaultBillingOption: Joi.string().error(errors.typeErrors.defaultBillingOption),
    billingOptions: Joi.array().items(
        Joi.string().error(errors.typeErrors.item_in_billingOptions)
    ),
    subscriptions: Joi.array().items(
        Joi.string().error(errors.typeErrors.item_in_subscriptions)
    ),
    orders: Joi.array().items(
        Joi.string().error(errors.typeErrors.item_in_orders)
    ),
    creationDate: Joi.date().error(errors.typeErrors.creationDate),
    lastModified: Joi.date().error(errors.typeErrors.lastModified),
    lastLogin: Joi.string().error(errors.typeErrors.lastLogin),
    isEmailVerified: Joi.boolean().error(errors.typeErrors.isEmailVerified),
    newsletterOptin: Joi.boolean().error(errors.typeErrors.newsletterOptin)
});