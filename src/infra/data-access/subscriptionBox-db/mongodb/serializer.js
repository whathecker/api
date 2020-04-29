const buildSerializer = require('../../_shared/serializerBuilder');

function _mapPrices (prices) {
    let mappedPrices = [];

    prices.forEach(priceObj => {
        mappedPrices.push({
            region: priceObj.region,
            currency: priceObj.currency,
            price: priceObj.price,
            vat: priceObj.vat,
            netPrice: priceObj.netPrice
        });
    });
    
    return mappedPrices;
}

function _mapItems (items) {
    let mappedItems = [];

    items.forEach(item => {
        mappedItems.push(item);
    });

    return mappedItems;
}

const _serializeSingleObjEntry = (subscriptionBox) => {
    return {
        _id: subscriptionBox._id,
        channel: subscriptionBox.channel,
        packageId: subscriptionBox.packageId,
        name: subscriptionBox.name,
        boxType: subscriptionBox.boxType,
        boxTypeCode: subscriptionBox.boxTypeCode,
        items: _mapItems(subscriptionBox.items),
        prices: _mapPrices(subscriptionBox.prices),
        creationDate: subscriptionBox.creationDate,
        lastModified: subscriptionBox.lastModified
    };
};

module.exports = buildSerializer(_serializeSingleObjEntry);