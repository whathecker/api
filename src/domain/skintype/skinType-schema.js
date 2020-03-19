const Joi = require('@hapi/joi');

module.exports = Joi.object({
    skinType: Joi.string().required().error(new Error('SkinType object must have a skinType as string')),
    skinTypeCode: Joi.string().error(new Error('Product object has invalid type at property: skinTypeCode'))
});