const buildSerializer = require('../../_shared/serializerBuilder');

function _serializeInventoryObj (inventory) {
    return {
        quantityOnHand: inventory.quantityOnHand,
        quarantaine: inventory.quarantaine,
        lastModified: inventory.lastModified
    };
}

function _mapInventoryHistory (inventoryHistory) {
    let mappedInventoryHistory = [];

    inventoryHistory.forEach(history => {
        mappedInventoryHistory.push(_serializeInventoryObj(history));
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
        inventory: _serializeInventoryObj(product.inventory),
        inventoryHistory: _mapInventoryHistory(product.inventoryHistory),
        prices: _mapPrices(product.prices),
        volume: (product.volume)? product.volume: null,
        creationDate: product.creationDate,
        lastModified: product.lastModified,
        eanCode: (product.eanCode)? product.eanCode: null
    }
};

module.exports = buildSerializer(_serializeSingleObjEntry);