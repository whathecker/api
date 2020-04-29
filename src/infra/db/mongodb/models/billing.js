const mongoose = require('../connection');

const Schema = mongoose.Schema;

let billingSchema =  new Schema({
    user_id: { type: String, required: true },
    type: { type: String, required: true },
    recurringDetail: { type: String, default: '' },
    billingId: { type: String },
    /** 
     * tokenRefundStatus is status to represent
     * if amount being processed to create payment token has refunded or not.
     */
    tokenRefundStatus: {
        type: String,
        uppercase: true,
        enum: ['NOT_REQUIRED', 'REQUIRED', 'REFUNDED'],
        default: 'NOT_REQUIRED'
    },
    creationDate: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now }
});

const Billing = mongoose.model('Billing', billingSchema);

module.exports = Billing;