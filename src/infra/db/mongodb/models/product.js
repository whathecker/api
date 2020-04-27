const mongoose = require('../connection');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

let inventorySchema = new Schema({
    quantityOnHand: { type: Number, default: 0 },
    quarantaine: { type: Number, default: 0 },
    lastModified: { type: Date, default: Date.now },
    /** add carted as array to hold QTY in cart of user
     * and create Cart model to support shopping cart 
     */
}, { _id: false });

let pricesSchema = new Schema({
    region: { 
        type: String,
        required: true, 
        lowercase: true, 
        enum: ['eu'], 
        default: 'eu' 
    },
    currency: { 
        type: String, 
        required: true, 
        lowercase: true, 
        enum: ['euro'], 
        default: 'euro' 
    },
    price: { 
        type: String, 
        required: true, 
        default: "0.00" 
    },
    vat: { 
        type: String, 
        required: true, 
        default: "0.00" 
    },
    netPrice: { 
        type: String, 
        required: true, 
        default: "0.00"
    }
}, { _id: false });


let productSchema = new Schema({
    channel: { 
        type: String, 
        required: true,
        uppercase: true, 
        enum: ['EU'], 
        default: 'EU' 
    },
    productId: { 
        type: String, 
        required: true, 
        //unique: true, 
        //index: true 
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    categoryCode: { type: String, required: true },
    brand: { type: String, required: true },
    brandCode: { type: String, required: true },
    volume: { type: String },
    skinType: { type: String, required: true },
    prices : [pricesSchema],
    inventory: inventorySchema,
    inventoryHistory: [inventorySchema],
    creationDate: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now },
    eanCode: { type: String }
});

productSchema.plugin(uniqueValidator);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;