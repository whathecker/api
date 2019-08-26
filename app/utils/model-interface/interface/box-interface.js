const SubscriptionBox = require('../../../models/SubscriptionBox');

const boxInterface = {};

/**
 * public method: createBoxInstance
 * @param {Object} boxDetail 
 * object contain following fields: 
 * name (string),
 * boxType object (with skinType, skinTypeCode),
 * 
 * Return: new instance of SubscriptionBox
 */

boxInterface.createBoxInstance = (boxDetail) => {

    if (!boxDetail) {
        throw new Error('Missing argument: cannot create SubscriptionBox instance without boxDetail argument');
    }

    const box = new SubscriptionBox();

    box.boxType = boxDetail.boxType.skinType;
    box.boxTypeCode = boxDetail.boxType.skinTypeCode;
    box.id = box.createPackageId(box.boxTypeCode);
    box.name = boxDetail.name;

    return box;
}


/**
 * public method: addPriceDetail
 * @param {Object} boxInstance 
 * instance of SubscriptionBox model to add price detail
 * 
 * @param {Array} priceDetails 
 * Array contain price objects with following fields:
 * price, vatRate
 * 
 * Return: extended instance of Order with price detail
 */

boxInterface.addPriceDetail = (boxInstance, priceDetails) => {

    if (!boxInstance) {
        throw new Error('Missing argument: boxInstance');
    }

    if (!priceDetails) {
        throw new Error('Missing argument: priceDetails');
    }

    if (!boxInstance.isPriceDataValid(priceDetails)) {
        throw new Error('Invalid prices data');
    }

    if (boxInstance.isPriceDataValid(priceDetails)) {
        for (let i = 0; i < priceDetails.length; i++) {
            const price = priceDetails[i].price;
            const vatRate = 0.21;
            priceDetails[i].vat = boxInstance.setVat(price, vatRate);
            priceDetails[i].netPrice = boxInstance.setNetPrice(price, vatRate);
        }
        boxInstance.prices = priceDetails;
    }

    return boxInstance;

} 

/**
 * public method: addItemDetails
 * @param {Object} boxInstance 
 * instance of SubscriptionBox model to add price detail
 * 
 * @param {Array} items 
 * Array contain Product instances
 * 
 * Return: extended instance of Order with items detail
 */

boxInterface.addItemDetails = (boxInstance ,items) => {
    if (!items) {
        throw new Error('Missing argument: items');
    }

    if (!boxInstance) {
        throw new Error('Missing argument: boxInstance');
    }

    let arr = [];

    items.forEach(item => {
        const _id = item._id;
        arr.push(_id);
    });

    boxInstance.items = arr;

    return boxInstance;
    
}

module.exports = boxInterface;
