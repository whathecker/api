const Joi = require('@hapi/joi');

module.exports = Joi.object({
    channel: Joi.string().required().error(new Error('Product object has invalid type at property: channel')),
    id: Joi.string().required().error(new Error('Product object must have id property as string')),
    name: Joi.string().require().error(new Error('Product object must have description property as string')),
    category: Joi.string().required().error(new Error('Product object must have category property as string')),
    
    brand: Joi.string().required().error(new Error('Product object must have brand property as string')),

    volume: Joi.string().error(new Error('Product object has invalid type at property: volume')),
    skinType: Joi.string().required().error(new Error('Product object must have skinType property as string')),
    creationDate: Joi.date().error(new Error('Product object has invalid type at property: creationDate')),
    lastModified: Joi.date().error(new Error('Product object has invalid type at property: lastModified')),
    eanCode: Joi.string().error('Product object has invalid type at property: eanCode')
});