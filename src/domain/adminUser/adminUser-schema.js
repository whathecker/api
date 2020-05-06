const errors = require('./adminUser-error');
const Joi = require('@hapi/joi');

module.exports = Joi.object({
    email: Joi.string().required().error(errors.typeErrors.email),
    userId: Joi.string().error(errors.typeErrors.userId),
    hash: Joi.string().error(errors.typeErrors.hash),
    salt: Joi.string().error(errors.typeErrors.salt),
    pwdResetToken: Joi.string().error(errors.typeErrors.pwdResetToken),
    firstName: Joi.string().error(errors.typeErrors.firstName),
    lastName: Joi.string().error(errors.typeErrors.lastName),
    mobileNumber: Joi.string().error(errors.typeErrors.mobileNumber),
    creationDate: Joi.date().error(errors.typeErrors.creationDate),
    lastModified: Joi.date().error(errors.typeErrors.lastModified),
    lastLogin: Joi.date().error(errors.typeErrors.lastLogin),
    isEmailVerified: Joi.boolean().error(errors.typeErrors.isEmailVerified),
    adminApprovalRequired: Joi.boolean().error(errors.typeErrors.adminApprovalRequired),
    isActive: Joi.boolean().error(errors.typeErrors.isActive),
});