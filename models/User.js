const mongoose = require('mongoose');
const crypto = require('crypto');

let userSchema = new mongoose.Schema({
    email: { type: String, lowercase: true, required: true, unique: true, index: true },
    hash: { type: String, lowercase: false, required: true },
    salt: { type: String },
    firstname: { type: String, lowercase: true, required: true },
    lastname: { type: String, lowercase: true, required: true },
    creationDate: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);


User.prototype.setPassword = (user, password) => {
    return crypto.pbkdf2Sync(password, user.salt, 10000, 512, 'sha512').toString('hex');
}

User.prototype.validatePassword = (user, password) => {
    const hashed = crypto.pbkdf2Sync(password, user.salt, 10000, 512, 'sha512').toString('hex');
    return hashed === user.hash;

}

User.prototype.generateToken = () => {

}

module.exports = User;
