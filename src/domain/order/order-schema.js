const Joi = require('@hapi/joi');
const errors = require('./order-error');

module.exports = Joi.object({
    country: Joi.string().required().error(errors.typeErrors.country),
    orderNumber: Joi.string().error(errors.typeErrors.orderNumber),
    user_id: Joi.string().required().error(errors.typeErrors.user_id),
    billingAddress: Joi.object({
        firstName: Joi.string().required().error(errors.typeErrors.firstName_in_billing_address),
        lastName: Joi.string().required().error(errors.typeErrors.lastName_in_billing_address),
        mobileNumber: Joi.string().error(errors.typeErrors.mobileNumber_in_billing_address),
        postalCode: Joi.string().required().error(errors.typeErrors.postalCode_in_billing_address),
        houseNumber: Joi.string().required().error(errors.typeErrors.houseNumber_in_billing_address),
        houseNumberAdd: Joi.string().error(errors.typeErrors.houseNumberAdd_in_billing_address),
        streetName: Joi.string().required().error(errors.typeErrors.streetName_in_billing_address),
        country: Joi.string().required().error(errors.typeErrors.country_in_billing_address)
    }),
    shippingAddress: Joi.object({
        firstName: Joi.string().required().error(errors.typeErrors.firstName_in_shipping_address),
        lastName: Joi.string().required().error(errors.typeErrors.lastName_in_shipping_address),
        mobileNumber: Joi.string().error(errors.typeErrors.mobileNumber_in_shipping_address),
        postalCode: Joi.string().required().error(errors.typeErrors.postalCode_in_shipping_address),
        houseNumber: Joi.string().required().error(errors.typeErrors.houseNumber_in_shipping_address),
        houseNumberAdd: Joi.string().error(errors.typeErrors.houseNumberAdd_in_shipping_address),
        streetName: Joi.string().required().error(errors.typeErrors.streetName_in_shipping_address),
        country: Joi.string().required().error(errors.typeErrors.country_in_shipping_address)
    }),
    isSubscription: Joi.boolean().error(errors.typeErrors.isSubscription),
    
    orderStatus: Joi.object({
        status: Joi.string().required().error(errors.typeErrors.status_in_orderStatus),
        timestamp: Joi.date().error(errors.typeErrors.timestamp_in_orderStatus)
    }),
    orderStatusHistory: Joi.array().items(
        Joi.object({
            status: Joi.string().required().error(errors.typeErrors.status_in_orderStatusHistory),
            timestamp: Joi.date().error(errors.typeErrors.timestamp_in_orderStatusHistory)
        })
    ),
    
    paymentMethod: Joi.object({
        type: Joi.string().required().error(errors.typeErrors.type_in_paymentMethod),
        recurringDetail: Joi.string().required().error(errors.typeErrors.recurringDetail_in_paymentMethod)
    }),
    paymentStatus: Joi.object({
        status: Joi.string().required().error(errors.typeErrors.status_in_paymentStatus),
        timestamp: Joi.date().error(errors.typeErrors.timestamp_in_paymentStatus)
    }),
    paymentHistory: Joi.array().items(
        Joi.object({
            status: Joi.string().required().error(errors.typeErrors.status_in_paymentHistory),
            timestamp: Joi.date().error(errors.typeErrors.timestamp_in_paymentHistory)
        })
    ),

    creationDate: Joi.date().error(errors.typeErrors.creationDate),
    lastModified: Joi.date().error(errors.typeErrors.lastModified),
    deliverySchedule: Joi.date().error(errors.typeErrors.deliverySchedule),
    isShipped: Joi.boolean().error(errors.typeErrors.isShipped),
    courier: Joi.string().error(errors.typeErrors.courier),
    trackingNumber: Joi.array().items(
        Joi.string().error(errors.typeErrors.item_in_trackingNumber)
    ),
    isConfEmailDelivered: Joi.boolean().error(errors.typeErrors.isConfEmailDelivered),
    orderAmountPerItem: Joi.array().items(
        Joi.object({
            itemId: Joi.string().required().error(errors.typeErrors.itemId_in_orderAmountPerItem),
            name: Joi.string().required().error(errors.typeErrors.name_in_orderAmountPerItem),
            quantity: Joi.number().required().error(errors.typeErrors.quantity_in_orderAmountPerItem),
            currency: Joi.string().required().error(errors.typeErrors.currency_in_orderAmountPerItem),
            originalPrice: Joi.string().required().error(errors.typeErrors.originalPrice_in_orderAmountPerItem),
            discount: Joi.string().required().error(errors.typeErrors.discount_in_orderAmountPerItem),
            vat: Joi.string().required().error(errors.typeErrors.vat_in_orderAmountPerItem),
            grossPrice: Joi.string().required().error(errors.typeErrors.grossPrice_in_orderAmountPerItem),
            netPrice: Joi.string().required().error(errors.typeErrors.netPrice_in_orderAmountPerItem),
            sumOfDiscount: Joi.string().required().error(errors.typeErrors.sumOfDiscount_in_orderAmountPerItem),
            sumOfVat: Joi.string().required().error(errors.typeErrors.sumOfVat_in_orderAmountPerItem),
            sumOfGrossPrice: Joi.string().required().error(errors.typeErrors.sumOfGrossPrice_in_orderAmountPerItem),
            sumOfNetPrice: Joi.string().required().error(errors.typeErrors.sumOfNetPrice_in_orderAmountPerItem)
        })
    ),
    shippedDate: Joi.date().error(errors.typeErrors.shippedDate),
    orderAmount: Joi.object({
        currency: Joi.string().required().error(errors.typeErrors.currency_in_orderAmount),
        totalDiscount: Joi.string().required().error(errors.typeErrors.totalDiscount_in_orderAmount),
        totalVat: Joi.string().required().error(errors.typeErrors.totalVat_in_orderAmount),
        totalAmount: Joi.string().required().error(errors.typeErrors.totalAmount_in_orderAmount),
        totalNetPrice: Joi.string().required().error(errors.typeErrors.totalNetPrice_in_orderAmount)
    }),
    shippedAmount: Joi.object({
        currency: Joi.string().required().error(errors.typeErrors.currency_in_shippedAmount),
        totalDiscount: Joi.string().required().error(errors.typeErrors.totalDiscount_in_shippedAmount),
        totalVat: Joi.string().required().error(errors.typeErrors.totalVat_in_shippedAmount),
        totalAmount: Joi.string().required().error(errors.typeErrors.totalAmount_in_shippedAmount),
        totalNetPrice: Joi.string().required().error(errors.typeErrors.totalNetPrice_in_shippedAmount)
    }),
    shippedAmountPerItem: Joi.array().items(
        Joi.object({
            itemId: Joi.string().required().error(errors.typeErrors.itemId_in_shippedAmountPerItem),
            name: Joi.string().required().error(errors.typeErrors.name_in_shippedAmountPerItem),
            quantity: Joi.number().required().error(errors.typeErrors.quantity_in_shippedAmountPerItem),
            currency: Joi.string().required().error(errors.typeErrors.currency_in_shippedAmountPerItem),
            originalPrice: Joi.string().required().error(errors.typeErrors.originalPrice_in_shippedAmountPerItem),
            discount: Joi.string().required().error(errors.typeErrors.discount_in_shippedAmountPerItem),
            vat: Joi.string().required().error(errors.typeErrors.vat_in_shippedAmountPerItem),
            grossPrice: Joi.string().required().error(errors.typeErrors.grossPrice_in_shippedAmountPerItem),
            netPrice: Joi.string().required().error(errors.typeErrors.netPrice_in_shippedAmountPerItem),
            sumOfVat: Joi.string().required().error(errors.typeErrors.sumOfVat_in_shippedAmountPerItem),
            sumOfDiscount: Joi.string().required().error(errors.typeErrors.sumOfDiscount_in_shippedAmountPerItem),
            sumOfGrossPrice: Joi.string().required().error(errors.typeErrors.sumOfGrossPrice_in_shippedAmountPerItem),
            sumOfNetPrice: Joi.string().required().error(errors.typeErrors.sumOfNetPrice_in_shippedAmountPerItem)
        })
    ),
    invoiceNumber: Joi.string().error(errors.typeErrors.invoiceNumber)
});