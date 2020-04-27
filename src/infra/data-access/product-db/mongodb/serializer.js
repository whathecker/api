const buildSerializer = require('../../_shared/serializerBuilder');

function _mapInventoryHistory (inventoryHistory) {
    let mappedInventoryHistory = [];

    inventoryHistory.forEach(history => {
        mappedInventoryHistory.push({
            lastModified: history.lastModified,
            quantityOnHand: history.quantityOnHand,
            quarantaine: history.quarantaine
        });
    });

    return mappedInventoryHistory;
};

function _mapPrices (prices) {
    let mappedPrices = [];

    prices.forEach(price => {
        mappedPrices.push({
            currency: price.currency,
            region: price.region,
            price: price.price,
            vat: price.vat,
            netPrice: price.netPrice,
        });
    });

    return mappedPrices;
}

const _serializeSingleObjEntry = (product) => {
    return {
        _id: product._id,
        channel: product.channel,
        productId: product.productId,
        name: product.name,
        description: product.description,
        category: product.category,
        categoryCode: product.categoryCode,
        brand: product.brand,
        brandCode: product.brandCode,
        skinType: product.skinType,
        inventory: {
            lastModified: product.inventory.lastModified,
            quantityOnHand: product.inventory.quantityOnHand,
            quarantaine: product.inventory.quarantaine
        },
        inventoryHistory: _mapInventoryHistory(product.inventoryHistory),
        prices: _mapPrices(product.price),
        //volume: product.volume,
        creationDate: product.creationDate,
        lastModified: product.lastModified,
        //eanCode: product.eanCode
    }
};

module.exports = buildSerializer(_serializeSingleObjEntry);