const mongoose = require('../connection');

const Schema = mongoose.Schema;

let userSchema = new Schema({
    email: { 
        type: String, 
        lowercase: true, 
        required: true
    },
    userId: { type: String },
    hash: { 
        type: String, 
        lowercase: false, 
        required: true
    },
    salt: { type: String },
    pwdResetToken: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobileNumber: { type: String },
    addresses: [String], // array of _id of address obj
    defaultShippingAddress: { type: String }, // _id of address obj
    defaultBillingAddress: { type: String }, // _id of address obj
    defaultBillingOption: { type: String }, // billingId
    billingOptions: [String], // array of billingId
    subscriptions: [String], // array of subscriptionId
    orders: [String], // array of orderNumber
    creationDate: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    isEmailVerified: { type: Boolean, default: false },
    newsletterOptin: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);

module.exports = User;