const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

let userSchema = new Schema({
    email: { 
        type: String, 
        lowercase: true, 
        required: [ true, "email can't be blank" ], 
        unique: true, 
        match: [ /\S+@\S+\.\S+/, 'invalid email format' ], 
        index: true 
    },
    hash: { 
        type: String, 
        lowercase: false, 
        required: [ true, "password can't be blank" ] 
    },
    salt: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    mobileNumber: { type: String },
    addresses: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
    defaultShippingAddress: { type: Schema.Types.ObjectId, ref: 'Address' },
    defaultBillingAddress: { type: Schema.Types.ObjectId, ref: 'Address' },
    billingOptions: [{ type: Schema.Types.ObjectId, ref: 'Billing' }],
    subscriptions: [{ type: Schema.Types.ObjectId, ref: 'Subscription'}],
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    creationDate: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    isEmailVerified: { type: Boolean, default: false },
    newsletterOptin: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false }
});

userSchema.plugin(uniqueValidator);
const User = mongoose.model('User', userSchema);


User.prototype.setPassword = (user, password) => {
    return crypto.pbkdf2Sync(password, user.salt, 10000, 512, 'sha512').toString('hex');
}

User.prototype.validatePassword = (user, password) => {
    const hashed = crypto.pbkdf2Sync(password, user.salt, 10000, 512, 'sha512').toString('hex');
    return hashed === user.hash;
}

module.exports = User;
