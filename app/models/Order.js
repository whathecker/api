const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator'),
    orderNumberPrefixes = require('../../app/utils/orderNumberPrefixes');

let orderSchema = new Schema({
    orderNumber: { 
        type: String, 
        required: [ true, "order number can't be blank" ], 
        unique: true, 
        index: true 
    },
    user: { 
        type: Schema.Types.ObjectId, 
        required: [ true, "user id can't be blank" ], 
        ref: 'User' 
    },

    isSubscription: { type: Boolean, default: false },
    orderStatus: { type: String, default: 'received' },
    paymentMethod: { type: String, required: [ true, "payment method can't be blank" ]},
    paymentStatus: [{ type: String, default: 'open' /* to add timestamp of each update */ }],
    creationDate: { type: Date, default: Date.now },
    isShipped: { type: Boolean, default: false },
    shippedDate: { type: Date },
    shippingCarrier: { type: String },
    trackingNumber: [{ type: String }],
    isDelivered: { type: Boolean, default: false },
    deliveredDate: { type: Date },
    lastModified: { type: Date, default: Date.now },
    items: [
        { type: Schema.Types.ObjectId, ref: 'Product' }
    ]
});

orderSchema.plugin(uniqueValidator);
const Order = mongoose.model('Order', orderSchema);

Order.prototype.createOrderNumber = (env, country) => {

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

    function create5DigitInteger () {
        const num = Math.floor(Math.random() * 90000) + 10000;
        return num.toString();
    }

    let orderNumber = '';
    return orderNumber.concat(envPrefix, countryPrefix, create5DigitInteger(), create5DigitInteger());
}

module.exports = Order;