const mongoose = require('mongoose');
const Schema =  mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const subscriptionPrefixes = require('../utils/subscriptionPrefixes');

let deliveryScheduleSchema = new Schema({
    orderNumber: { type: String },
    nextDeliveryDate : { type: Date },
    year: { type: Number },
    month: { type: Number },
    date: { type: Number },
    day: { type: Number },
    isProcessed: { type: Boolean, default: false }, /** this field is not in use */
}, { _id: false });

let packageSchema = new Schema({
    itemId: { type: String },
    quantity: { type: Number, default: 1 }
}, { _id: false });

let subscriptionSchema = new Schema({
    channel: { type: String, uppercase: true, enum: ['EU'], default: 'EU' },
    subscriptionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    creationDate: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now },
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
    deliverySchedules: [deliveryScheduleSchema],
    endDate: { type: Date },
    isWelcomeEmailSent: { type: Boolean, default: false },
    subscribedItems: [packageSchema],
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    paymentMethod: { type: Schema.Types.ObjectId, ref: 'Billing' },
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    isActive: { type: Boolean, default: true }
});

subscriptionSchema.plugin(uniqueValidator);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

Subscription.prototype.createSubscriptionId = (env, country) => {
    let envPrefix;
    // refactor to actual env variable in use
    if (
        env === "test" ||env=== "local" || env === "development" || env === "staging" || env === "production") {
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

Subscription.prototype.setFirstDeliverySchedule = (deliveryDay, orderNumber) => {
    const dateAtMoment = Date.now();
    const dateAtMomentInObj = new Date(dateAtMoment);
    const dayOfCurrentDate = dateAtMomentInObj.getDay();
    let gapBetweenDates;

   // find next clostest deliveryDay
    if (dayOfCurrentDate < deliveryDay) {
        gapBetweenDates = deliveryDay - dayOfCurrentDate;
    }
    if (dayOfCurrentDate > deliveryDay) {
        gapBetweenDates = 7 - (dayOfCurrentDate - deliveryDay);   
    }
    // when order is placed on the date of deliveryDay (default: Thursday)
    // first delivery day will be Friday as exception
    if (dayOfCurrentDate === deliveryDay) {
        gapBetweenDates = 1;
    }

    const deliveryDateinMSeconds = dateAtMoment + (gapBetweenDates * 24 * 60 * 60 * 1000);
    const deliveryDateInObj = new Date(deliveryDateinMSeconds);
    const deliverySchedule = {
        orderNumber: orderNumber? orderNumber : '',
        nextDeliveryDate: deliveryDateInObj,
        year: deliveryDateInObj.getFullYear(),
        month: deliveryDateInObj.getMonth(),
        date: deliveryDateInObj.getDate(),
        day: deliveryDateInObj.getDay()
    };

    return deliverySchedule;
}

Subscription.prototype.setDeliverySchedule = (prevDeliverySchdule, deliveryFrequncy, deliveryDay, orderNumber) => {
    // get previous deliverySchedule in milliseconds
    const prevDateInTime = prevDeliverySchdule.getTime();
    const prevDateInObj = new Date(prevDateInTime);
    const dayOfPrevDate = prevDateInObj.getDay();
    let gapBetweenDates = 0;
    let nextDeliveryDate;

    // find nextDeliveryDate
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
        orderNumber: orderNumber? orderNumber : '',
        nextDeliveryDate: nextDeliveryDate,
        year: nextDeliveryDateinObj.getFullYear(),
        month: nextDeliveryDateinObj.getMonth(),
        date: nextDeliveryDateinObj.getDate(),
        day: nextDeliveryDateinObj.getDay()
    };
    //console.log(deliverySchedule);
    return deliverySchedule;
}

Subscription.prototype.clearFirstQueuedSchedule = (queueItems) => {
    const deliverySchedules = queueItems;
    deliverySchedules.sort((a, b) => {
        if (a.nextDeliveryDate < b.nextDeliveryDate) {
            return -1;
        }
        if (a.nextDeliveryDate > b.nextDeliveryDate) {
            return 1;
        }
    }).shift();

    return deliverySchedules;
}
module.exports = Subscription;



