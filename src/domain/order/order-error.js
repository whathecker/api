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
    timestamp_in_orderStatus: new Error('Order object has invalid type at property: timestamp in orderStatus prop')
});

const genericErrors = Object.freeze({
    
});

module.exports = {
    typeErrors: typeErrors,
    genericErrors: genericErrors
};