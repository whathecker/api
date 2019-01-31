const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator');
    crypto = require('crypto');

let userSchema = new mongoose.Schema({
    email: { type: String, lowercase: true, required: [ true, "email can't be blank" ], unique: true, match: [ /\S+@\S+\.\S+/, 'invalid email format' ], index: true },
    hash: { type: String, lowercase: false, required: [ true, "password can't be blank" ] },
    salt: { type: String },
    firstname: { type: String, lowercase: true },
    lastname: { type: String, lowercase: true },
    creationDate: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now },
    isEmailVerified: { type: Boolean, default: false },
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
