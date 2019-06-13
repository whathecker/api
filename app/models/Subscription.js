const mongoose = require('mongoose'),
    Schema =  mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator'),
    subscriptionPrefixes = require('../utils/subscriptionPrefixes');

let subscriptionSchema = new Schema({
    subscriptionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    creationDate: { type: Date, default: Date.now },
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

module.exports = Subscription;



