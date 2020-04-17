const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

let subscriptionBoxSchema = new Schema({
    channel: { 
        type: String, 
        uppercase: true, 
        enum: ['EU'], 
        default: 'EU' 
    },
    id: { 
        type: String, 
        required: true, 
        unique: true, 
        index: true 
    },
    name: { type: String, required: true },
    boxType: { type: String, required: true },
    boxTypeCode: { type: String, required: true },
    items: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    prices: [pricesSchema],
    creationDate: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now }
});

let pricesSchema = new Schema({
    region: { 
        type: String, 
        lowercase: true, 
        enum: ['eu'], 
        default: 'eu' 
    },
    currency: { 
        type: String, 
        lowercase: true, 
        enum: ['euro'], 
        default: 'euro' 
    },
    vat: { type: String, default: "0.00" },
    price: { type: String, default: "0.00" },
    netPrice: { type: String, default: "0.00" }
}, { _id: false });

subscriptionBoxSchema.plugin(uniqueValidator);

const SubscriptionBox = mongoose.model('SubscriptionBox', subscriptionBoxSchema);

module.exports = SubscriptionBox;