const mongoose = require('mongoose');
const crypto = require('crypto');

let userSchema = new mongoose.Schema({
    email: { type: String, lowercase: true, required: true, unique: true, },
    password: { type: String, lowercase: false, required: true },
    firstname: { type: String, lowercase: true, required: true },
    lastname: { type: String, lowercase: true, required: true },
    creationDate: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);


User.prototype.setPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
}

User.prototype.validatePassword = (user, password) => {
    const hashed = crypto.createHash('sha256').update(password).digest('hex');
    return user.password === hashed;
}

User.prototype.generateToken = () => {

}

module.exports = User;
