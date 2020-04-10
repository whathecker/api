const Joi = require('@hapi/joi');
const errors = require('./subscription-error');

module.exports = Joi.object({
    country: Joi.string().required().error(errors.typeErrors.country),
    channel: Joi.string().required().error(errors.typeErrors.channel),
    subscriptionId: Joi.string().error(errors.typeErrors.subscriptionId),
    creationDate: Joi.date().error(errors.typeErrors.creationDate),
    lastModified: Joi.date().error(errors.typeErrors.lastModified),
    deliveryFrequency: Joi.number().required().error(errors.typeErrors.deliveryFrequency),
    deliveryDay: Joi.number().required().error(errors.typeErrors.deliveryDay),
    isWelcomeEmailSent: Joi.boolean().required().error(errors.typeErrors.isWelcomeEmailSent),
    user: Joi.string().required().error(errors.typeErrors.user),
    paymentMethod: Joi.string().required().error(errors.typeErrors.paymentMethod),
    isActive: Joi.boolean().required().error(errors.typeErrors.isActive),
    orders: Joi.array().error(errors.typeErrors.orders),
    subscribedItems: Joi.array().items(
        Joi.object({
            itemId: Joi.string().required().error(errors.typeErrors.itemId_in_subscribedItems),
            quantity: Joi.number().required().error(errors.typeErrors.quantity_in_subscribedItems),
        })
    ),
    deliverySchedules: Joi.array().items(
        Joi.object({
            orderNumber: Joi.string().required().error(errors.typeErrors.orderNumber_in_deliverySchedules),
            nextDeliveryDate: Joi.date().required().error(errors.typeErrors.nextDeliveryDate_in_deliverySchedules),
            year: Joi.number().required().error(errors.typeErrors.year_in_deliverySchedules),
            month: Joi.number().required().error(errors.typeErrors.month_in_deliverySchedules),
            date: Joi.number().required().error(errors.typeErrors.date_in_deliverySchedules),
            day: Joi.number().required().error(errors.typeErrors.day_in_deliverySchedules),
        })
    ),
    endDate: Joi.date().error(errors.typeErrors.endDate)
});