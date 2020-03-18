const Joi = require('@hapi/joi');
const errors = require('./product-error');

module.exports = Joi.object({
    channel: Joi.string().required().error(errors.typeErrors.channel),
    id: Joi.string().error(errors.typeErrors.id),
    name: Joi.string().required().error(errors.typeErrors.name),
    description: Joi.string().required().error(errors.typeErrors.description),
    category: Joi.string().required().error(errors.typeErrors.category),
    categoryCode: Joi.string().required().error(errors.typeErrors.categoryCode),
    brand: Joi.string().required().error(errors.typeErrors.brand),
    brandCode: Joi.string().required().error(errors.typeErrors.brandCode),
    volume: Joi.string().error(errors.typeErrors.volume),
    skinType: Joi.string().required().error(errors.typeErrors.skinType),
    creationDate: Joi.date().error(errors.typeErrors.creationDate),
    lastModified: Joi.date().error(errors.typeErrors.lastModified),
    eanCode: Joi.string().error(errors.typeErrors.eanCode),
    prices: Joi.array().items(
        Joi.object({
            region: Joi.string().required().error(errors.typeErrors.region_in_prices),
            currency: Joi.string().required().error(errors.typeErrors.currency_in_prices),
            price: Joi.string().required().error(errors.typeErrors.price_in_prices),
            vat: Joi.string().error(errors.typeErrors.vat_in_prices),
            netPrice: Joi.string().error(errors.typeErrors.netPrice_in_prices)
        })
    ),
    inventory: Joi.object({
        quantityOnHand: Joi.number().required().error(errors.typeErrors.quantityOnHand_in_inventory),
        quarantaine: Joi.number().required().error(errors.typeErrors.quarantaine_in_inventory),
        lastModified: Joi.date().error(errors.typeErrors.lastModified_in_inventory)
    }),
    inventoryHistory: Joi.array().items(
        Joi.object({
            quantityOnHand: Joi.number().required().error(errors.typeErrors.quantityOnHand_in_inventoryHistory),
            quarantaine: Joi.number().required().error(errors.typeErrors.quarantaine_in_inventoryHistory),
            lastModified: Joi.date().error(errors.typeErrors.lastModified_in_inventoryHistory)
        })
    )
});