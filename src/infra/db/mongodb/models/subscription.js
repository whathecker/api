const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema =  mongoose.Schema;

let subscriptionSchema = new Schema({
    channel: { 
        type: String, 
        uppercase: true, 
        enum: ['EU'], 
        default: 'EU' 
    },
    subscriptionId: {
        type: String,
        unique: true,
        index: true
    },
    deliveryFrequency: { 
        type: Number,
        default: 28
     },
    deliveryDay: {
        type: Number,
        enum: [ 0, 1, 2, 3, 4, 5, 6],
        default: 4
    },
    deliverySchedules: [deliveryScheduleSchema],
    subscribedItems: [packageSchema],
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    paymentMethod: { type: Schema.Types.ObjectId, ref: 'Billing' },
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    endDate: { type: Date },
    isWelcomeEmailSent: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    creationDate: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now },
});

let deliveryScheduleSchema = new Schema({
    orderNumber: { type: String },
    nextDeliveryDate : { type: Date },
    year: { type: Number },
    month: { type: Number },
    date: { type: Number },
    day: { type: Number },
}, { _id: false });

let packageSchema = new Schema({
    itemId: { type: String },
    quantity: { type: Number, default: 1 }
}, { _id: false });

subscriptionSchema.plugin(uniqueValidator);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;