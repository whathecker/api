const Joi = require('@hapi/joi');
const errors = require('./address-error');

module.exports = Joi.object({
    user_id: Joi.string().required().error(errors.typeErrors.user_id),
    firstName: Joi.string().required().error(errors.typeErrors.firstName),
    lastName: Joi.string().required().error(errors.typeErrors.lastName),
    mobileNumber: Joi.string().error(errors.typeErrors.mobileNumber),
    postalCode: Joi.string().required().error(errors.typeErrors.postalCode),
    houseNumber: Joi.string().required().error(errors.typeErrors.houseNumber),
    houseNumberAdd : Joi.string().error(errors.typeErrors.houseNumberAdd),
    streetName: Joi.string().required().error(errors.typeErrors.streetName),
    city: Joi.string().required().error(errors.typeErrors.city),
    province: Joi.string().error(errors.typeErrors.province),
    country: Joi.string().required().error(errors.typeErrors.country),
    creationDate: Joi.date().error(errors.typeErrors.creationDate),
    lastModified: Joi.date().error(errors.typeErrors.lastModified)
});