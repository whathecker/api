const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

let userSchema = new Schema({
    email: { 
        type: String, 
        lowercase: true, 
        required: [ true, "email can't be blank" ], 
        unique: true, 
        match: [ /\S+@\S+\.\S+/, 'invalid email format' ], 
        index: true 
    },
    userId: {
        type: String,
        unique: true,
        index: true
    },
    hash: { 
        type: String, 
        lowercase: false, 
        required: [ true, "password can't be blank" ] 
    },
    salt: { type: String },
    pwdResetToken: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    mobileNumber: { type: String },
    addresses: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
    defaultShippingAddress: { type: Schema.Types.ObjectId, ref: 'Address' },
    defaultBillingAddress: { type: Schema.Types.ObjectId, ref: 'Address' },
    defaultBillingOption: { type: Schema.Types.ObjectId, ref: 'Billing'},
    billingOptions: [{ type: Schema.Types.ObjectId, ref: 'Billing' }],
    subscriptions: [{ type: Schema.Types.ObjectId, ref: 'Subscription'}],
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    creationDate: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    isEmailVerified: { type: Boolean, default: false },
    newsletterOptin: { type: Boolean, default: false },
});

userSchema.plugin(uniqueValidator);
const User = mongoose.model('User', userSchema);

module.exports = User;