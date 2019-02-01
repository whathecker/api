const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator');

let productSchema = new Schema({
    productId: { type: String, required: true, unique: true, index: true },
    productName: { type: String, required: true },
    productDescription: { type: String, required: true },
    /* add available regions with active status of item,
        may be add inventoy here..?
        may be price too ..?
     */  

    /* add product category from separate model*/
    /* add price object contain price per country */
});

productSchema.plugin(uniqueValidator);
const Product = mongoose.model('Product', productSchema);

module.exports = Product;