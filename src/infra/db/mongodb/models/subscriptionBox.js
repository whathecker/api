const mongoose = require('../connection');

const Schema = mongoose.Schema;

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

let subscriptionBoxSchema = new Schema({
    channel: { 
        type: String, 
        uppercase: true, 
        enum: ['EU'], 
        default: 'EU' 
    },
    packageId: { type: String, required: true },
    name: { type: String, required: true },
    boxType: { type: String, required: true },
    boxTypeCode: { type: String, required: true },
    items: [String],
    prices: [pricesSchema],
    creationDate: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now }
});

const SubscriptionBox = mongoose.model('SubscriptionBox', subscriptionBoxSchema);

module.exports = SubscriptionBox;