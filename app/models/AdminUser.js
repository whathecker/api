const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const crypto = require('crypto');

let adminUserSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        require: [ true, "email can't be blank"],
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
    creationDate: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    isEmailVerified: { type: Boolean, default: false },
    adminApprovalRequired: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false }
});

adminUserSchema.plugin(uniqueValidator);

const AdminUser = mongoose.model('AdminUser', adminUserSchema);


function create5DigitInteger () {
    const num = Math.floor(Math.random() * 90000) + 10000;
    return num.toString();
}

AdminUser.prototype.setPassword = (user, password) => {
    return crypto.pbkdf2Sync(password, user.salt, 10000, 512, 'sha512').toString('hex');
}

AdminUser.prototype.setAdminUserId = ()=> {
    let prefix = "ADMIN"
    const random5digitsInt = create5DigitInteger();
    return prefix.concat(random5digitsInt);
}

module.exports = AdminUser;