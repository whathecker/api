const typeErrors = Object.freeze({
    country: new Error("Checkout object must have country as string"),
    checkoutState: new Error("Checkout object has invalid type at property: checkoutState"),
    user_id: new Error("Checkout object has invalid type at property: user_id"),
    anonymous_id: new Error("Checkout object has invalid type at property: anonymous_id"),
    isSubscription: new Error("Checkout object has invalid type at property: isSubscription"),
    
    itemId_in_lineItems: new Error("Checkout object must have itemId property in lineItems array as string"),
    name_in_lineItems: new Error("Checkout object must have name property in lineItems array as string"),
    currency_in_lineItems: new Error("Checkout object must have currency property in lineItems array as string"),
    quantity_in_lineItems: new Error("Checkout object must have quantity property in lineItems array as number"),
    originalPrice_in_lineItems: new Error("Checkout object must have originalPrice property in lineItems array as string"),
    discount_in_lineItems: new Error("Checkout object must have discount property in lineItems array as string"),
    vat_in_lineItems: new Error("Checkout object must have vat property in lineItems array as string"),
    grossPrice_in_lineItems: new Error("Checkout object must have grossPrice property in lineItems array as string"),
    netPrice_in_lineItems: new Error("Checkout object must have netPrice property in lineItems array as string"),
    sumOfGrossPrice_in_lineItems: new Error("Checkout object must have sumOfGrossPrice property in lineItems array as string"),
    sumOfNetPrice_in_lineItems: new Error("Checkout object must have sumOfNetPrice property in lineItems array as string"),
    sumOfVat_in_lineItems: new Error("Checkout object must have sumOfVat property in lineItems array as string"),
    sumOfDiscount_in_lineItems: new Error("Checkout object must have sumOfDiscount property in lineItems array as string"),

    currency_in_totalPrice: new Error("Checkout object must have currency property in totalPrice object as string"),
    totalAmount_in_totalPrice: new Error("Checkout object must have totalAmount property in totalPrice object as string"),
    totalDiscount_in_totalPrice: new Error("Checkout object must have totalDiscount property in totalPrice object as string"),
    totalVat_in_totalPrice: new Error("Checkout object must have totalVat property in totalPrice object as string"),
    totalNetPrice_in_totalPrice: new Error("Checkout object must have totalNetPrice property in totalPrice object as string"),

    firstName_in_billingAddress: new Error("Checkout object must have firstName property in billingAddress object as string"),
    lastName_in_billingAddress: new Error("Checkout object must have lastName property in billingAddress object as string"),
    mobileNumber_in_billingAddress: new Error("Checkout object has invalid type at property: mobileNumber prop in billingAddress object"),
    postalCode_in_billingAddress: new Error("Checkout object must have postalCode property in billingAddress object as string"),
    houseNumber_in_billingAddress: new Error("Checkout object must have houseNumber property in billingAddress object as string"),
    houseNumberAdd_in_billingAddress: new Error("Checkout object has invalid type at property: houseNumberAdd prop in billingAddress object"),
    streetName_in_billingAddress: new Error("Checkout object must have streetName property in billingAddress object as string"),
    country_in_billingAddress: new Error("Checkout object must have country property in billingAddress object as string"),

    firstName_in_shippingAddress: new Error("Checkout object must have firstName property in shippingAddress object as string"),
    lastName_in_shippingAddress: new Error("Checkout object must have lastName property in shippingAddress object as string"),
    mobileNumber_in_shippingAddress: new Error("Checkout object has invalid type at property: mobileNumber prop in shippingAddress object"),
    postalCode_in_shippingAddress: new Error("Checkout object must have postalCode property in shippingAddress object as string"),
    houseNumber_in_shippingAddress: new Error("Checkout object must have houseNumber property in shippingAddress object as string"),
    houseNumberAdd_in_shippingAddress: new Error("Checkout object has invalid type at property: houseNumberAdd prop in shippingAddress object"),
    streetName_in_shippingAddress: new Error("Checkout object must have streetName property in shippingAddress object as string"),
    country_in_shippingAddress: new Error("Checkout object must have country property in shippingAddress object as string"),

    shippingMethod_in_shippingInfo: new Error("Checkout object must have shippingMethod property in shippingInfo object as string"),
    currency_in_shippingInfo: new Error("Checkout object must have currency property in price of shippingInfo object as string"),
    amount_in_shippingInfo: new Error("Checkout object must have amount property in price of shippingInfo object as string"),

    paymentMethodType_in_paymentInfo: new Error("Checkout object must have paymentMethodType property in paymentInfo object as string"),
    paymentId_in_paymentInfo: new Error("Checkout object must have paymentId property in paymentInfo object as string"),
});

const genericErrors = Object.freeze({
    invalid_checkout_status: new Error("Checkout object contain invalid value in checkoutState field: double check your payload"),
    conflict_ownership: new Error("Checkout object contain both user_id and anonymous_id"),
});

module.exports = {
    typeErrors: typeErrors,
    genericErrors: genericErrors
};