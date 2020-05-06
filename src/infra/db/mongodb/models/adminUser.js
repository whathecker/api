const mongoose = require('../connection');

const Schema = mongoose.Schema;

let adminUserSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        require: true,
    },
    userId: { type: String, required: true },
    hash: { 
        type: String, 
        lowercase: false, 
        required: true
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

const AdminUser = mongoose.model('AdminUser', adminUserSchema);


module.exports = AdminUser;