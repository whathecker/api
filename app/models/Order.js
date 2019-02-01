const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    orderNumberPrefixes = require('../../app/utils/orderNumberPrefixes');

let orderSchema = new mongoose.Schema({
    orderNumber: { 
        type: String, 
        required: [ true, "order number can't be blank"], 
        unique: true, 
        index: true 
    },
    /*
    user: { type: ObjectId, ref: 'User' },
    cart: { type: ObjectId, ref: 'Cart' }, */
    orderStatus: { type: String, default: 'received' },
    paymentMethod: { type: String, required: [ true, "payment method can't be blank" ]},
    paymentStatus: { type: String, default: 'open' /* use sub document? */ },
    creationDate: { type: Date, default: Date.now },
    isShipped: { type: Boolean, default: false },
    shippedDate: { type: Date },
    shippingCarrier: { type: String },
    trackingNumber: { type: String /* make is as array of String */ },
    isDelivered: { type: Boolean, default: false },
    deliveredDate: { type: Date },
    lastModified: { type: Date, default: Date.now }
});

orderSchema.plugin(uniqueValidator);
const Order = mongoose.model('Order', orderSchema);

Order.prototype.createOrderNumber = (env, country) => {

    let timestampToInteger = Date.now();
    const random13DigitInteger = Math.floor(Math.random() * 9000000000000) + 1000000000000;
    timestampToInteger += random13DigitInteger;
    timestampToInteger = timestampToInteger.toString().slice(0,5);
    console.log('this is timestamp: ' + timestampToInteger);


    let envPrefix;
    if (env === "development" || env === "staging" || env === "production") {
        envPrefix = orderNumberPrefixes.enviornmentPrefix[env];
    } else {
        throw new Error("Parameter 'env' contain invalid value");
    }
    console.log(envPrefix);

    let countryPrefix;
    if (country === "netherland" || country === "germany" || country === "america") {
        countryPrefix = orderNumberPrefixes.countryPrefix[country];
    } else {
        throw new Error("Parameter 'country' contain invalid value");
    }
    console.log(countryPrefix);


    let random5DigitInteger = Math.floor(Math.random() * 90000) + 10000;
    random5DigitInteger.toString();
    console.log("random 5 digit num: " + random5DigitInteger);

    let orderNumber = '';
    return orderNumber.concat(envPrefix, countryPrefix, timestampToInteger, random5DigitInteger);
}

module.exports = Order;