const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

let billingSchema =  new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    recurringDetail: { type: String, default: '' },
    billingId: { type: String, unique: true },
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

billingSchema.plugin(uniqueValidator);

const Billing = mongoose.model('Billing', billingSchema);

module.exports = Billing;