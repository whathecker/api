const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

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
    adminApprovalRequired: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true }
});

adminUserSchema.plugin(uniqueValidator);

const AdminUser = mongoose.model('AdminUser', adminUserSchema);


module.exports = AdminUser;