const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator');

let productSchema = new Schema({
    productId: { type: String, required: true, unique: true, index: true },
    productName: { type: String, required: true },
    productDescription: { type: String, required: true },
    productCategory: { type: String, required: true },
    priceData : [{
        region: { type: String },
        currency: { type: String },
        price: { type: String }
    }]
});

productSchema.plugin(uniqueValidator);
const Product = mongoose.model('Product', productSchema);

// add method to create product ID

module.exports = Product;