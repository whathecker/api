const mongoose = require('mongoose'),
    Schema =  mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator'),
    subscriptionPrefixes = require('../utils/subscriptionPrefixes');

let deliveryScheduleSchema = new Schema({
    nextDeliveryDate : { type: Date },
    year: { type: Number },
    month: { type: Number },
    date: { type: Number },
    day: { type: Number },
    isProcessed: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, { _id: false });

let subscriptionSchema = new Schema({
    subscriptionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    creationDate: { type: Date, default: Date.now },
    deliveryFrequency: { 
        type: Number,
        enum: [ 7, 14, 28 ],
        default: 28
     },
    deliveryDay: {
        type: Number,
        enum: [ 0, 1, 2, 3, 4, 5, 6],
        default: 4
    },
    firstDeliverySchedule: deliveryScheduleSchema,
    nextDeliverySchedule: deliveryScheduleSchema,
    deliverySchedules: [deliveryScheduleSchema],
    endDate: { type: Date },
    isWelcomeEmailSent: { type: Boolean, default: false },
    package: { type: Schema.Types.ObjectId, ref: 'SubscriptionBox' },
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    paymentMethod: { type: Schema.Types.ObjectId, ref: 'Billing' },
    orders: [ { type: Schema.Types.ObjectId, ref: 'Order' }],
});

subscriptionSchema.plugin(uniqueValidator);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

Subscription.prototype.createSubscriptionId = (env, country) => {
    let envPrefix;
    // refactor to actual env variable in use
    if (
        env=== "local" || env === "development" || env === "staging" || env === "production") {
        envPrefix = subscriptionPrefixes.enviornmentPrefix[env];
    } else {
        throw new Error("Parameter 'env' contain invalid value");
    }
    console.log(envPrefix);

    const middlePrefix = "SB";

    let countryPrefix;
    if (country === "netherlands" || country === "germany" || country === "america") {
        countryPrefix = subscriptionPrefixes.countryPrefix[country];
    } else {
        throw new Error("Parameter 'country' contain invalid value");
    }
    console.log(countryPrefix);

    function create5DigitInteger () {
        const num = Math.floor(Math.random() * 90000) + 10000;
        return num.toString();
    }

    let subscriptionId = '';
    return subscriptionId.concat(envPrefix, middlePrefix, countryPrefix, create5DigitInteger(), create5DigitInteger());
}

Subscription.prototype.setFirstDeliverySchedule = (deliveryDay) => {
    const dateAtMoment = Date.now();
    const dateAtMomentInObj = new Date(dateAtMoment);
    const dayOfCurrentDate = dateAtMomentInObj.getDay();
    let gapBetweenDates;

   
    if (dayOfCurrentDate < deliveryDay) {
        gapBetweenDates = deliveryDay - dayOfCurrentDate;
    }

    if (dayOfCurrentDate > deliveryDay) {
        gapBetweenDates = 7 - (dayOfCurrentDate - deliveryDay);   
    }

    if (dayOfCurrentDate === deliveryDay) {
        gapBetweenDates = 1;
    }

    const deliveryDateinMSeconds = dateAtMoment + (gapBetweenDates * 24 * 60 * 60 * 1000);
    const deliveryDateInObj = new Date(deliveryDateinMSeconds);
    const deliverySchedule = {
        nextDeliveryDate: deliveryDateinMSeconds,
        year: deliveryDateInObj.getFullYear(),
        month: deliveryDateInObj.getMonth(),
        date: deliveryDateInObj.getDate(),
        day: deliveryDateInObj.getDay()
    };

    return deliverySchedule;
}

Subscription.prototype.setDeliverySchedule = (prevDeliverySchdule, deliveryFrequncy, deliveryDay) => {
    // get previous deliverySchedule in milliseconds
    const prevDateInTime = prevDeliverySchdule.getTime();
    const prevDateInObj = new Date(prevDateInTime);
    const dayOfPrevDate = prevDateInObj.getDay();
    let gapBetweenDates = 0;
    let nextDeliveryDate;
    // adjust next delivery to deliveryDay setup
    if (dayOfPrevDate < deliveryDay) {
        gapBetweenDates = deliveryDay - dayOfPrevDate;
        nextDeliveryDate = prevDateInTime + ((deliveryFrequncy + gapBetweenDates)* 24 * 60 * 60 * 1000);
    }

    if (dayOfPrevDate > deliveryDay) {
        gapBetweenDates = dayOfPrevDate - deliveryDay;
        nextDeliveryDate = prevDateInTime + ((deliveryFrequncy - gapBetweenDates)* 24 * 60 * 60 * 1000);
    }

    if (dayOfPrevDate === deliveryDay) {
        nextDeliveryDate = prevDateInTime + ((deliveryFrequncy)* 24 * 60 * 60 * 1000);
    }

    
    // create date obj to get year, month, date
    const nextDeliveryDateinObj = new Date(nextDeliveryDate);
    
    let deliverySchedule = {
        nextDeliveryDate: nextDeliveryDate,
        year: nextDeliveryDateinObj.getFullYear(),
        month: nextDeliveryDateinObj.getMonth(),
        date: nextDeliveryDateinObj.getDate(),
        day: nextDeliveryDateinObj.getDay()
    };
    //console.log(deliverySchedule);
    return deliverySchedule;
}

module.exports = Subscription;



