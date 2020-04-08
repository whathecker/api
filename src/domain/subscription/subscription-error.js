const typeErrors = Object.freeze({
    channel: new Error('Subscription object must have channel as string'),
    subscriptionId: new Error('Subscription object has invalid type at property: subscriptionId'),
    creationDate: new Error('Subscription object has invalid type at property: creationDate'),
    lastModified: new Error('Subscription object has invalid type at property: lastModified'),
    deliveryFrequency: new Error('Subscription object must have deliveryFrequency as number'),
    deliveryDay: new Error('Subscription object must have deliveryDay as number'),
    isWelcomeEmailSent: new Error('Subscription object must have isWelcomeEmailSent as boolean'),
    user: new Error('Subscription object must have user as string'),
    paymentMethod: new Error('Subscription object must have paymentMethod as string'),
    isActive: new Error('Subscription object must have isActive as boolean'),
    orders: new Error('Subscription object has invalid type at property: orders'),
    endDate: new Error('Subscription object has invalid type at property: endDate'),

    itemId_in_subscribedItems: new Error('Subscription object must have itemId in item of subscribedItems array as string'),
    quantity_in_subscribedItems: new Error('Subscription object must have quantity in item of subscribedItems array as number'),

    orderNumber_in_deliverySchedules: new Error('Subscription object must have orderNumber in item of deliverySchedules array as string'),
    nextDeliveryDate_in_deliverySchedules: new Error('Subscription object must have nextDeliveryDate in item of deliverySchedules array as date'),
    year_in_deliverySchedules: new Error('Subscription object must have year in item of deliverySchedules array as number'),
    month_in_deliverySchedules: new Error('Subscription object must have month in item of deliverySchedules array as number'),
    date_in_deliverySchedules: new Error('Subscription object must have date in item of deliverySchedules array as number'),
    day_in_deliverySchedules: new Error('Subscription object must have day in item of deliverySchedules array as number'),
});

const genericErrors = Object.freeze({
    
});

module.exports = {
    typeErrors: typeErrors,
    genericErrors: genericErrors
};