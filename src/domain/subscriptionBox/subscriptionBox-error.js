const typeErrors = Object.freeze({
    channel: new Error('SubscriptionBox object must have channel property as string'),
    id: new Error('SubscriptionBox object has invalid type at property: id'),
    name: new Error('SubscriptionBox object must have name property as string'),
    boxType: new Error('SubscriptionBox object must have boxType property as string'),
    boxTypeCode: new Error('SubscriptionBox object must have boxTypeCode property as string'),
    items: new Error('SubscriptionBox object has invalid type at property: items'),
    
    region_in_prices: new Error('SubscriptionBox object must have region property in prices array as string'),
    currency_in_prices: new Error('SubscriptionBox object must have currency property in prices array as string'),
    price_in_prices: new Error('SubscriptionBox object must have price property in prices array as string'),
    vat_in_prices: new Error('SubscriptionBox object has invalid type at property: vat of prices property'),
    netPrice_in_prices: new Error('SubscriptionBox object has invalid type at property: netPrice of prices property'),

    creationDate: new Error('SubscriptionBox object has invalid type at property: creationDate'),
    lastModified: new Error('SubscriptionBox object has invalid type at property: lastModified'),
});

const genericErrors = Object.freeze({
    zero_price: new Error('SubscriptionBox object contain invalid price in prices field: price cannot be 0'),
    invalid_region_in_price: new Error('SubscriptionBox object contain invalid region in prices field: double check region field from your input'),
    invalid_currency_in_price: new Error('SubscriptionBox object contain invalid currency in prices field: double check currency field from your input'),
    invalid_channel: new Error('SubscriptionBox object contain invalid channel property: double check your input')
});

module.exports =  {
    typeErrors: typeErrors,
    genericErrors: genericErrors
};