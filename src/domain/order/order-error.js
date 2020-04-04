const typeErrors = Object.freeze({
    orderNumber: new Error('Order object has invalid type at property: orderNumber'),
    user: new Error('Order object must have user property as string'),
    isSubscription: new Error('Order object has invalid type at property: isSubscription'),
    
    billingAddress: new Error('Order object must have billingAddress property as object'),
    firstName_in_billing_address: new Error('Order object must have firstName property in billingAddress object as string'),
    lastName_in_billing_address: new Error('Order object must have lastName property in billingAddress object as string'),
    mobileNumber_in_billing_address: new Error('Order object has invalid type at property: mobileNumber in billingAddress prop'),
    postalCode_in_billing_address: new Error('Order object must have postalCode property in billingAddress object as string'),
    houseNumber_in_billing_address: new Error('Order object must have houseNumber property in billingAddress object as string'),
    houseNumberAdd_in_billing_address: new Error('Order object has invalid type at property: houseNumberAdd in billingAddress prop'),
    streetName_in_billing_address: new Error('Order object must have streetName property in billingAddress object as string'),
    country_in_billing_address: new Error('Order object must have country property in billingAddress object as string'),

    shippingAddress: new Error('Order object must have shippingAddress property as object'),
    firstName_in_shipping_address: new Error('Order object must have firstName property in shippingAddress object as string'),
    lastName_in_shipping_address: new Error('Order object must have lastName property in shippingAddress object as string'),
    mobileNumber_in_shipping_address: new Error('Order object has invalid type at property: mobileNumber in shippingAddress prop'),
    postalCode_in_shipping_address: new Error('Order object must have postalCode property in shippingAddress object as string'),
    houseNumber_in_shipping_address: new Error('Order object must have houseNumber property in shippingAddress object as string'),
    houseNumberAdd_in_shipping_address: new Error('Order object has invalid type at property: houseNumberAdd in shippingAddress prop'),
    streetName_in_shipping_address: new Error('Order object must have streetName property in shippingAddress object as string'),
    country_in_shipping_address: new Error('Order object must have country property in shippingAddress object as string'),

    orderStatus: new Error('Order object must have orderStatus property as object'),
    status_in_orderStatus: new Error('Order object must have status property in orderStatus object as string'),
    timestamp_in_orderStatus: new Error('Order object has invalid type at property: timestamp in orderStatus prop'),

    orderStatusHistory: new Error('Order object must have orderStatusHistory property as array'),
    status_in_orderStatusHistory: new Error('Order object must have status property in orderStatusHistory array as string'),
    timestamp_in_orderStatusHistory: new Error('Order object has invalid type at property: timestamp in item of orderStatusHistory prop'),

    paymentMethod: new Error('Order object must have paymentMethod property as object'),
    type_in_paymentMethod: new Error('Order object must have type property in paymentMethod as string'),
    recurringDetail_in_paymentMethod: new Error('Order object must have recurringDetail property in paymentMethod as string'),

    paymentStatus: new Error('Order object must have paymentStatus property as object'),
    status_in_paymentStatus: new Error('Order object must have status property in paymentStatus as string'),
    timestamp_in_paymentStatus: new Error('Order object has invalid type at property: timestamp in paymentStatus prop'),

    paymentHistory: new Error('Order object must have paymentHistory property as array'),
    status_in_paymentHistory: new Error('Order object must have status property in paymentHistory array as string'),
    timestamp_in_paymentHistory: new Error('Order object has invalid type at property: timestamp in item of paymentHistory prop'),

    creationDate: new Error('Order object has invalid type at property: creationDate'),
    deliverySchedule: new Error('Order object has invalid type at property: deliverySchedule'),
    isShipped: new Error('Order object has invalid type at property: isShipped'),
    shippedDate: new Error('Order object has invalid type at property: shippedDate'),
    courier: new Error('Order object has invalid type at property: courier'),
    trackingNumber: new Error('Order object has invalid type at property: trackingNumber'),
    item_in_trackingNumber: new Error('Order object has invalid type at property: tracking number in trackingNumber prop'),
    isConfEmailDelivered: new Error('Order object has invalid type at property: isConfEmailDelivered'),
    lastModified: new Error('Order object has invalid type at property: lastModified'),
    invoiceNumber: new Error('Order object has invalid type at property: invoiceNumber'),

    orderAmountPerItem: new Error('Order object must have orderAmountPerItem property as array'),
    itemId_in_orderAmountPerItem: new Error('Order object must have itemId property in orderAmountPerItem array as string'),
    name_in_orderAmountPerItem: new Error('Order object must have name property in orderAmountPerItem array as string'),
    quantity_in_orderAmountPerItem: new Error('Order object must have quantity property in orderAmountPerItem array as number'),
    currency_in_orderAmountPerItem: new Error('Order object must have currency property in orderAmountPerItem array as string'),
    originalPrice_in_orderAmountPerItem: new Error('Order object must have originalPrice property in orderAmountPerItem array as string'),
    discount_in_orderAmountPerItem: new Error('Order object must have discount property in orderAmountPerItem array as string'),
    vat_in_orderAmountPerItem: new Error('Order object must have vat property in orderAmountPerItem array as string'),
    grossPrice_in_orderAmountPerItem: new Error('Order object must have grossPrice property in orderAmountPerItem array as string'),
    netPrice_in_orderAmountPerItem: new Error('Order object must have netPrice property in orderAmountPerItem array as string'),
    sumOfDiscount_in_orderAmountPerItem: new Error('Order object has invalid type at property: sumOfDiscount in item of orderAmountPerItem array'),
    sumOfVat_in_orderAmountPerItem: new Error('Order object has invalid type at property: sumOfVat in item of orderAmountPerItem array'),
    sumOfGrossPrice_in_orderAmountPerItem: new Error('Order object has invalid type at property: sumOfGrossPrice in item of orderAmountPerItem array'),
    sumOfNetPrice_in_orderAmountPerItem: new Error('Order object has invalid type at property: sumOfNetPrice in item of orderAmountPerItem array'),

    orderAmount: new Error('Order object must have orderAmount property as object'),
    currency_in_orderAmount: new Error('Order object must have currency property in orderAmount as string'),
    totalDiscount_in_orderAmount: new Error('Order object must have totalDiscount property in orderAmount as string'),
    totalVat_in_orderAmount: new Error('Order object must have totalVat property in orderAmount as string'),
    totalAmount_in_orderAmount: new Error('Order object must have totalAmount property in orderAmount as string'),
    totalNetPrice_in_orderAmount: new Error('Order object must have totalNetPrice property in orderAmount as string'),

    shippedAmount: new Error('Order object has invalid type at property: shippedAmount'),
    currency_in_shippedAmount: new Error('Order object must have currency property in shippedAmount as string'),
    totalDiscount_in_shippedAmount: new Error('Order object must have totalDiscount property in shippedAmount as string'),
    totalVat_in_shippedAmount: new Error('Order object must have totalVat property in shippedAmount as string'),
    totalAmount_in_shippedAmount: new Error('Order object must have totalAmount property in shippedAmount as string'),
    totalNetPrice_in_shippedAmount: new Error('Order object must have totalNetPrice property in shippedAmount as string'),

    shippedAmountPerItem: new Error('Order object has invalid type at property: shippedAmountPerItem'),
    itemId_in_shippedAmountPerItem: new Error('Order object must have itemId property in shippedAmountPerItem array as string'),
    name_in_shippedAmountPerItem: new Error('Order object must have name property in shippedAmountPerItem array as string'),
    quantity_in_shippedAmountPerItem: new Error('Order object must have quantity property in shippedAmountPerItem array as number'),
    currency_in_shippedAmountPerItem: new Error('Order object must have currency property in shippedAmountPerItem array as string'),
    originalPrice_in_shippedAmountPerItem: new Error('Order object must have originalPrice property in shippedAmountPerItem array as string'),
    discount_in_shippedAmountPerItem: new Error('Order object must have discount property in shippedAmountPerItem array as string'),
    vat_in_shippedAmountPerItem: new Error('Order object must have vat property in shippedAmountPerItem array as string'),
    grossPrice_in_shippedAmountPerItem: new Error('Order object must have grossPrice property in shippedAmountPerItem array as string'),
    netPrice_in_shippedAmountPerItem: new Error('Order object must have netPrice property in shippedAmountPerItem array as string'),
    sumOfDiscount_in_shippedAmountPerItem: new Error('Order object has invalid type at property: sumOfDiscount in item of shippedAmountPerItem array'),
    sumOfVat_in_shippedAmountPerItem: new Error('Order object has invalid type at property: sumOfVat in item of shippedAmountPerItem array'),
    sumOfGrossPrice_in_shippedAmountPerItem: new Error('Order object has invalid type at property: sumOfGrossPrice in item of shippedAmountPerItem array'),
    sumOfNetPrice_in_shippedAmountPerItem: new Error('Order object has invalid type at property: sumOfNetPrice in item of shippedAmountPerItem array'),
});

const genericErrors = Object.freeze({
    
});

module.exports = {
    typeErrors: typeErrors,
    genericErrors: genericErrors
};