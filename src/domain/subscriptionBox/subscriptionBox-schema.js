const errors = require('./subscriptionBox-error');
const Joi = require('@hapi/joi');

module.exports = Joi.object({
    channel: Joi.string().required().error(errors.typeErrors.channel),
    id: Joi.string().error(errors.typeErrors.id),
    name: Joi.string().required().error(errors.typeErrors.name),
    boxType: Joi.string().required().error(errors.typeErrors.boxType),
    boxTypeCode: Joi.string().required().error(errors.typeErrors.boxTypeCode),
    items: Joi.array().error(errors.typeErrors.items),
    prices: Joi.array().items(
        Joi.object({
            region: Joi.string().required().error(errors.typeErrors.region_in_prices),
            currency: Joi.string().required().error(errors.typeErrors.currency_in_prices),
            price: Joi.string().required().error(errors.typeErrors.price_in_prices),
            vat: Joi.string().error(errors.typeErrors.vat_in_prices),
            netPrice: Joi.string().error(errors.typeErrors.netPrice_in_prices)
        })
    ),
    creationDate: Joi.date().error(errors.typeErrors.creationDate),
    lastModified: Joi.date().error(errors.typeErrors.lastModified),
});