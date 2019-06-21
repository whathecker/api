const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator');

/*
let itemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product' }
}, { _id: false }); */

let pricesSchema = new Schema({
    region: { type: String, lowercase: true },
    currency: { type: String, lowercase: true },
    vat: { type: String, default: "0" },
    price: { type: String, default: "0" },
    netPrice: { type: String, default: "0" }
}, { _id: false });

let subscriptionBoxSchema = new Schema({
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    boxType: { type: String, required: true },
    boxTypeCode: { type: String, required: true },
    items: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    prices: [pricesSchema]
});

subscriptionBoxSchema.plugin(uniqueValidator);

const SubscriptionBox = mongoose.model('SubscriptionBox', subscriptionBoxSchema);


SubscriptionBox.prototype.findPackageType = (skinTypeInput, prefixes) => {
    if (!skinTypeInput) { throw new Error('Invalid param: skinType cannot be empty'); }

    let packageType = null;
    // assign code to skinTypeCode by looking up packageID prefixes
    for (let keyOfprefix in prefixes.boxTypePrefix) {
        if (skinTypeInput === keyOfprefix) {
            packageType = keyOfprefix;
        }
    }
    return packageType;

}

SubscriptionBox.prototype.findPackageTypeCode = (packageTypeInput, prefixes) => {
    if (!packageTypeInput) {
        throw new Error('Invalid param: packageTypeInput cannot be blank');
    }
    return prefixes.boxTypePrefix[packageTypeInput];
}


SubscriptionBox.prototype.createPackageId = (skinTypeCode) => {
    if(!skinTypeCode) { throw new Error('Invalid param: skinTypeCode cannot be empty'); }

    function create5DigitInteger () {
        const num = Math.floor(Math.random() * 90000) + 10000;
        return num.toString();
    }

    let packageId = '';
    return packageId.concat('PK', skinTypeCode, create5DigitInteger());
}


SubscriptionBox.prototype.isPriceDataValid = (priceInput) => {
    let isInputValid = true;

    priceInput.forEach((price) => {
        for (const prop in price) {
            console.log(prop);

            // technical dept alert!!! make it dynamic later
            if (prop === 'region') {
                if (price[prop] !== 'eu') {
                    console.log(price[prop]);
                    isInputValid = false;
                }
            }
            // technical dept alert!!! make it dynamic later
            if (prop === 'currency') {
                if (price[prop] !== 'euro') {
                    console.log(price[prop]);
                    isInputValid = false;
                }    
            }
            // technical dept alert!! add price format validation
            /*
            if (prop === 'price') {

            } */
        }
    });
    return isInputValid;
}

SubscriptionBox.prototype.setVat = (price, vatRate) => {
    const priceInNum = Number(price).toFixed(2);
    
    let netPrice = priceInNum / (1 + vatRate);
    netPrice = netPrice.toFixed(2);
    
    let vat = priceInNum - netPrice;
    
    return vat.toFixed(2);
}

SubscriptionBox.prototype.setNetPrice =  (price, vatRate) => {
    const priceInNum = Number(price).toFixed(2);
    let netPrice = priceInNum / (1 + vatRate);
    return netPrice.toFixed(2);
}

module.exports = SubscriptionBox;