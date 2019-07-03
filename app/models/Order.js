const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator'),
    orderNumberPrefixes = require('../../app/utils/orderNumberPrefixes');

let addressSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    mobileNumber: { type: String }, 
    postalCode: { type: String },
    houseNumber: { type: String },
    houseNumberAdd: { type: String },
    streetName: { type: String },
    country: { type: String }
}, { _id: false });

let paymentMethodSchema = new Schema({
    type: { type: String },
    recurringDetail: { type: String }
}, { _id: false });

let paymentStatusSchema = new Schema({
    status: { 
        type: String,
        uppercase: true,
        enum: ['OPEN', 'AUTHORIZED', 'PENDING', 'REFUSED', 'CANCELED', 'REFUNDED'],
        default: 'OPEN'
    },
    timestamp: { type: Date, default: Date.now }
}, { _id: false });

let orderStatusSchema = new Schema({
    status: { 
        type: String,
        uppercase: true,
        enum: ['RECEIVED','PENDING', 'PAID', 'SHIPPED', 'CANCELED', 'OVERDUE'],
        default: 'RECEIVED'
    },
    timestamp: { type: Date, default: Date.now }
},{ _id: false });

let orderAmountSchema = new Schema({
    region: { type: String, lowercase: true },
    currency: { type: String, lowercase: true },
    vat: { type: String, default: "0" },
    totalAmount: { type: String, default: "0" },
    totalNetPrice: { type: String, default: "0" }
}, { _id: false });

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
    billingAddress: addressSchema,
    shippingAddress: addressSchema,
    isSubscription: { type: Boolean, default: false },
    orderStatus: orderStatusSchema,
    orderStatusHistory: [orderStatusSchema],
    paymentMethod: paymentMethodSchema,
    paymentStatus: paymentStatusSchema,
    paymentHistory: [paymentStatusSchema],
    creationDate: { type: Date, default: Date.now },
    deliverySchedule: { type: Date },
    isShipped: { type: Boolean, default: false },
    shippedDate: { type: Date },
    shippingCarrier: { type: String },
    trackingNumber: [{ type: String }],
    isDelivered: { type: Boolean, default: false },
    deliveredDate: { type: Date },
    lastModified: { type: Date, default: Date.now },
    package: { type: Schema.Types.ObjectId, ref: 'SubscriptionBox'},
    items: [
        { type: Schema.Types.ObjectId, ref: 'Product' }
    ],
    shippedItems: [
        { type: Schema.Types.ObjectId, ref: 'Product'}
    ],
    orderAmount: orderAmountSchema,
    shippedAmount: orderAmountSchema,
    invoiceNumber: { 
        type: String, 
        unique: true
    }
});

orderSchema.plugin(uniqueValidator);
const Order = mongoose.model('Order', orderSchema);

function create5DigitInteger () {
    const num = Math.floor(Math.random() * 90000) + 10000;
    return num.toString();
}

Order.prototype.createOrderNumber = (env, country) => {

    let envPrefix;
    // refactor to actual env variable in use
    if (env=== "local" || env === "development" || env === "staging" || env === "production") {
        envPrefix = orderNumberPrefixes.enviornmentPrefix[env];
    } else {
        throw new Error("Parameter 'env' contain invalid value");
    }
    console.log(envPrefix);

    let countryPrefix;
    if (country === "netherlands" || country === "germany" || country === "america") {
        countryPrefix = orderNumberPrefixes.countryPrefix[country];
    } else {
        throw new Error("Parameter 'country' contain invalid value");
    }
    console.log(countryPrefix);


    let orderNumber = '';
    return orderNumber.concat(envPrefix, countryPrefix, create5DigitInteger(), create5DigitInteger());
}

Order.prototype.createInvoiceNumber = () => {
    let invoiceNumber = '';
    // create random 5digits integer
    const random5digitsInt = create5DigitInteger();
    const currentDate = new Date(Date.now());
    const year = currentDate.getFullYear().toString().slice(2);
    let month;
    let date;
    let hour;

    if (currentDate.getMonth() < 10) {
        month = "0" + currentDate.getMonth().toString();
    } else {
        month = currentDate.getMonth().toString();
    }

    if (currentDate.getDate() < 10) {
        date = "0" + currentDate.getDate().toString();
    } else {
        date = currentDate.getDate().toString();
    }

    if (currentDate.getHours() < 10) {
        hour = "0" + currentDate.getHours().toString();
    } else {
        hour = currentDate.getHours().toString();
    }

    return invoiceNumber.concat(hour, date, month, year, random5digitsInt);
}

module.exports = Order;