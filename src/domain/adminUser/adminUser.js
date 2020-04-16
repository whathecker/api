const AdminUserFactory = require('./factory');

let buildCreateAdminUser = function (adminUserValidator) {
    return ({
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
    } = {}) => {

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

        const result = adminUserValidator(payload);

        if (result instanceof Error) {
            return result;
        }

        return new AdminUserFactory(payload);
    }
}

module.exports = buildCreateAdminUser;