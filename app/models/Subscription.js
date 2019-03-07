const mongoose = require('mongoose'),
    Schema =  mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator');

let subscriptionSchema = new Schema({
    subscriptionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    creationDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    package: { type: Schema.Types.ObjectId, ref: 'SubscriptionBox' },
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    orders: [ { type: Schema.Types.ObjectId, ref: 'Order' }]
});

subscriptionSchema.plugin(uniqueValidator);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;



