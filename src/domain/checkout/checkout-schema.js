const Joi = require('@hapi/joi');
const errors = require('./checkout-error');

module.exports = Joi.object({
    country: Joi.string().required().error(errors.typeErrors.country),
    checkoutState: Joi.string().error(errors.typeErrors.checkoutState),
    user_id: Joi.string().error(errors.typeErrors.user_id),
    anonymous_id: Joi.string().error(errors.typeErrors.anonymous_id),
    isSubscription: Joi.boolean().error(errors.typeErrors.isSubscription),
    lineItems: Joi.array().items(
        Joi.object({
            itemId: Joi.string().required().error(errors.typeErrors.itemId_in_lineItems),
            name: Joi.string().required().error(errors.typeErrors.name_in_lineItems),
            currency: Joi.string().required().error(errors.typeErrors.currency_in_lineItems),
            quantity: Joi.number().required().error(errors.typeErrors.quantity_in_lineItems),
            originalPrice: Joi.string().required().error(errors.typeErrors.originalPrice_in_lineItems),
            discount: Joi.string().required().error(errors.typeErrors.discount_in_lineItems),
            vat: Joi.string().required().error(errors.typeErrors.vat_in_lineItems),
            grossPrice: Joi.string().required().error(errors.typeErrors.grossPrice_in_lineItems),
            netPrice: Joi.string().required().error(errors.typeErrors.netPrice_in_lineItems),
            sumOfGrossPrice: Joi.string().required().error(errors.typeErrors.sumOfGrossPrice_in_lineItems),
            sumOfNetPrice: Joi.string().required().error(errors.typeErrors.sumOfNetPrice_in_lineItems),
            sumOfVat: Joi.string().required().error(errors.typeErrors.sumOfVat_in_lineItems),
            sumOfDiscount: Joi.string().required().error(errors.typeErrors.sumOfDiscount_in_lineItems)
        })
    ),
    totalPrice: Joi.object({
        currency: Joi.string().required().error(errors.typeErrors.currency_in_totalPrice),
        totalAmount: Joi.string().required().error(errors.typeErrors.totalAmount_in_totalPrice),
        totalDiscount: Joi.string().required().error(errors.typeErrors.totalDiscount_in_totalPrice),
        totalVat: Joi.string().required().error(errors.typeErrors.totalVat_in_totalPrice),
        totalNetPrice: Joi.string().required().error(errors.typeErrors.totalNetPrice_in_totalPrice)
    }),
    billingAddress: Joi.object({
        firstName: Joi.string().required().error(errors.typeErrors.firstName_in_billingAddress),
        lastName: Joi.string().required().error(errors.typeErrors.lastName_in_billingAddress),
        mobileNumber: Joi.string().error(errors.typeErrors.mobileNumber_in_billingAddress),
        postalCode: Joi.string().required().error(errors.typeErrors.postalCode_in_billingAddress),
        houseNumber: Joi.string().required().error(errors.typeErrors.houseNumber_in_billingAddress),
        houseNumberAdd: Joi.string().error(errors.typeErrors.houseNumberAdd_in_billingAddress),
        streetName: Joi.string().required().error(errors.typeErrors.streetName_in_billingAddress),
        country: Joi.string().required().error(errors.typeErrors.country_in_billingAddress)
    }),
    shippingAddress: Joi.object({
        firstName: Joi.string().required().error(errors.typeErrors.firstName_in_shippingAddress),
        lastName: Joi.string().required().error(errors.typeErrors.lastName_in_shippingAddress),
        mobileNumber: Joi.string().error(errors.typeErrors.mobileNumber_in_shippingAddress),
        postalCode: Joi.string().required().error(errors.typeErrors.postalCode_in_shippingAddress),
        houseNumber: Joi.string().required().error(errors.typeErrors.houseNumber_in_shippingAddress),
        houseNumberAdd: Joi.string().error(errors.typeErrors.houseNumberAdd_in_shippingAddress),
        streetName: Joi.string().required().error(errors.typeErrors.streetName_in_shippingAddress),
        country: Joi.string().required().error(errors.typeErrors.country_in_shippingAddress)
    }),
    shippingInfo: Joi.object({
        shippingMethod: Joi.string().required().error(errors.typeErrors.shippingMethod_in_shippingInfo),
        price: Joi.object({
            currency: Joi.string().required().error(errors.typeErrors.currency_in_shippingInfo),
            amount: Joi.string().required().error(errors.typeErrors.amount_in_shippingInfo),
        })
    }),
    paymentInfo: Joi.object({
        paymentMethodType: Joi.string().required().error(errors.typeErrors.paymentMethodType_in_paymentInfo),
        paymentId: Joi.string().required().error(errors.typeErrors.paymentId_in_paymentInfo)
    }),
});