const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator');

let pricesSchema = new Schema({
    region: { type: String, lowercase: true },
    currency: { type: String, lowercase: true },
    price: { type: String, default: "0" },
    vat: { type: String, default: "0"},
    netPrice: { type: String, default: "0 "}
}, { _id: false });

let productSchema = new Schema({
    channel: { type: String },
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    categoryCode: { type: String, required: true },
    brand: { type: String },
    brandCode: { type: String },
    volume: { type: String },
    skinType: { type: String },
    prices : [pricesSchema],
    creationDate: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now }
});

productSchema.plugin(uniqueValidator);
const Product = mongoose.model('Product', productSchema);

Product.prototype.createProductId = (brandCode, categoryCode) => {
    if (!brandCode || !categoryCode) {
        throw new Error('Invalid Param: brandCode and categoryCode can not be empty');
    }

    function create5DigitInteger () {
        const num = Math.floor(Math.random() * 90000) + 10000;
        return num.toString();
    }

    let productId = '';
    return productId.concat(brandCode, categoryCode, create5DigitInteger());
}

Product.prototype.findCategory = (categoryInput, productIdPrefixes) => {
    for (let category in productIdPrefixes.categoryPrefix) {
        //console.log(category);
        if (categoryInput === category) {
            return category;
        }
    }
    return null;  
}

Product.prototype.findCategoryCode = (categoryNameInput, productIdPrefixes) => {
    if (!categoryNameInput) {
        throw new Error('Invalid Param: categoryNameInput cannot be blank');
    }
    return productIdPrefixes.categoryPrefix[categoryNameInput];
}

Product.prototype.findBrand = (brandInput, productIdPrefixes) => {
    for (let brand in productIdPrefixes.brandPrefix) {
        if (brandInput === brand) {
            return brand;
        }
    }
    return null;
}

Product.prototype.findBrandCode = (brandNameInput, productIdPrefixes) => {
    if (!brandNameInput) {
        throw new Error('Invalid Param: brandNameInput cannot be blank');
    }
    return productIdPrefixes.brandPrefix[brandNameInput]; 
}

Product.prototype.isSkintypeValid = (skinTypeInput) => {
    const acceptedSkinTypeValues = ['normal', 'dry', 'oily'];
    for (let i = 0 ; i < acceptedSkinTypeValues.length; i++) {
        if (skinTypeInput === acceptedSkinTypeValues[i]) {
            return true;
        }
    }
    return false;
}

Product.prototype.isPriceDataValid = (priceInput) => {
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

Product.prototype.setVat = (price, vatRate) => {
    const priceInNum = Number(price).toFixed(2);
    
    let netPrice = priceInNum / (1 + vatRate);
    netPrice = netPrice.toFixed(2);

    let vat = priceInNum - netPrice;

    return vat.toFixed(2);
}

Product.prototype.setNetPrice = (price, vatRate) => {
    const priceInNum = Number(price).toFixed(2);
    let netPrice = priceInNum / (1 + vatRate);
    return netPrice.toFixed(2);
}

module.exports = Product;