const errors = require('../adminUser-error');
const UserBaseFactory = require('../../_shared/factory').user_base_factory;

class AdminUserFactory extends UserBaseFactory {
    constructor({
        email,
        userId,
        hash,
        salt,
        pwdResetToken,
        firstName,
        lastName,
        mobileNumber,
        creationDate,
        lastModified,
        lastLogin,
        isEmailVerified,
        adminApprovalRequired,
        isActive
    } = {}) {

        const result_email = AdminUserFactory.validateEmailAddress(email);

        if (!result_email) {
            return errors.genericErrors.invalid_email;
        }

        if (!userId) {
            userId = AdminUserFactory.createAdminUserId();
        }

        const payload = {
            email,
            userId,
            hash,
            salt,
            pwdResetToken,
            firstName,
            lastName,
            mobileNumber,
            creationDate,
            lastModified,
            lastLogin,
            isEmailVerified,
            adminApprovalRequired,
            isActive
        };

        return new AdminUser(payload);
    }

    static createAdminUserId () {
        let prefix = "ADMIN";
        const randomFiveDigitsNum = Math.floor(Math.random() * 90000) + 10000;
        return prefix.concat(randomFiveDigitsNum);
    }

}

class AdminUser {
    constructor({
        email,
        userId,
        hash,
        salt,
        pwdResetToken,
        firstName,
        lastName,
        mobileNumber,
        creationDate,
        lastModified,
        lastLogin,
        isEmailVerified,
        adminApprovalRequired,
        isActive
    } = {}) {

        this.email = email;
        this.userId = userId;

        (firstName)? this.firstName = firstName: null;
        (lastName)? this.lastName = lastName: null;
        (hash)? this.hash = hash : null;
        (salt)? this.salt = salt : null;
        (pwdResetToken)? this.pwdResetToken = pwdResetToken : null;
        (mobileNumber)? this.mobileNumber = mobileNumber : null;
        (creationDate)? this.creationDate = creationDate : null;
        (lastModified)? this.lastModified = lastModified : null;
        (lastLogin)? this.lastLogin = lastLogin : null;
        (isEmailVerified)? this.isEmailVerified = isEmailVerified : null;
        (adminApprovalRequired)? this.adminApprovalRequired = adminApprovalRequired : null;
        (isActive)? this.isActive = isActive : null;
    }
}

module.exports = AdminUserFactory;