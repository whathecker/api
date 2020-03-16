const Joi = require('@hapi/joi');

module.exports = Joi.object({
    categoryName: Joi.string().required().error(new Error('Category object must have a categoryName as string')),
    categoryCode: Joi.string().required().error(new Error('Category object must have a categoryCode as string'))
});