const mongoose = require('../connection');

const Schema =  mongoose.Schema;

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

let subscriptionSchema = new Schema({
    country: { type: String, required: true },
    channel: { 
        type: String, 
        uppercase: true, 
        enum: ['EU'], 
        default: 'EU' 
    },
    subscriptionId: { type: String },
    deliveryFrequency: { type: Number, default: 28 },
    deliveryDay: {
        type: Number,
        enum: [ 0, 1, 2, 3, 4, 5, 6],
        default: 4
    },
    deliverySchedules: [deliveryScheduleSchema],
    subscribedItems: [packageSchema],
    user_id: { type: String },
    paymentMethod_id: { type: String },
    orders: [String],
    endDate: { type: Date },
    isWelcomeEmailSent: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    creationDate: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;