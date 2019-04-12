const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let billingSchema =  new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    recurringDetail: { type: String, default: '' }
});

billingSchema.plugin(uniqueValidator);
const Billing = mongoose.model('Billing', billingSchema);

module.exports = Billing;