const Joi = require('@hapi/joi');

module.exports = Joi.object({
    brandName: Joi.string().required().error(new Error('Brand object must have a brandName as string')),
    brandCode: Joi.string().required().error(new Error('Brand object must have a brandCode as string'))
});