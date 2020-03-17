const typeErrors = Object.freeze({
    channel: new Error('Product object has invalid type at property: channel'),
    id: new Error('Product object must have id property as string'),
    name: new Error('Product object must have name property as string'),
    description: new Error('Product object must have description property as string'),
    category: new Error('Product object must have category property as string'),
    categoryCode: new Error('Product object must have categoryCode property as string'),
    brand: new Error('Product object must have brand property as string'),
    brandCode: new Error('Product object must have brandCode property as string'),
    volume: new Error('Product object has invalid type at property: volume'),
    skinType: new Error('Product object must have skinType property as string'),
    creationDate: new Error('Product object has invalid type at property: creationDate'),
    lastModified: new Error('Product object has invalid type at property: lastModified'),
    eanCode: new Error('Product object has invalid type at property: eanCode'),
    
    region_in_prices: new Error('Product object must have region property in prices array as string'),
    currency_in_prices: new Error('Product object must have currency property in prices array as string'),
    price_in_prices: new Error('Product object must have price property in prices array as string'),
    vat_in_prices: new Error('Product object has invalid type at property: vat of prices property'),
    netPrice_in_prices: new Error('Product object has invalid type at property: netPrice of prices property'),

    quantityOnHand_in_inventory: new Error('Product object must have quantityOnHand property in inventory as number'),
    quarantaine_in_inventory: new Error('Product object must have quarantaine property in inventory as number'),
    lastModified_in_inventory: new Error('Product object has invalid type at property: lastModified of inventory field'),
    
    quantityOnHand_in_inventoryHistory: new Error('Product object must have quantityOnHand property in inventoryHistory as number'),
    quarantaine_in_inventoryHistory: new Error('Product object must have quarantaine property in inventoryHistory as number'),
    lastModified_in_inventoryHistory: new Error('Product object has invalid type at property: lastModified of inventoryHistory field'),
});

const genericErrors = Object.freeze({
    zero_price: new Error('Product object contain invalid price in prices field: price cannot be 0'),
    invalid_region_in_price: new Error('Product object contain invalid region in prices field: double check region field from your input'),
    invalid_currency_in_price: new Error('Product object contain invalid currency in prices field: double check currency field from your input'),
    invalid_channel: new Error('Product object contain invalid channel property: double check your input')
});


module.exports = {
    typeErrors: typeErrors,
    genericErrors: genericErrors
};