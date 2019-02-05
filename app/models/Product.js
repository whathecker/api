const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator');

let pricesSchema = new Schema({
    region: { type: String, lowercase: true },
    currency: { type: String, lowercase: true },
    price: { type: String, default: "0" }
}, { _id: false });

let productSchema = new Schema({
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    categoryCode: { type: String, required: true },
    brand: { type: String },
    brandCode: { type: String },
    volume: { type: String },
    skinType: { type: String },
    priceData : [pricesSchema]
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
        console.log(category);
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


module.exports = Product;