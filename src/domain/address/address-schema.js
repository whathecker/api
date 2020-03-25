const Joi = require('@hapi/joi');
const errors = require('./address-error');

module.exports = Joi.object({
    channel: Joi.string().required().error(errors.typeErrors.channel)
});