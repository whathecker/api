const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator');

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
    priceData : [{
        region: { type: String, lowercase: true },
        currency: { type: String, lowercase: true },
        price: { type: Number }
    }]
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

module.exports = Product;