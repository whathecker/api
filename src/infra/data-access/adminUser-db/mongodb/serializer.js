const buildSerializer = require('../../_shared/serializerBuilder');

const _serializeSingleObjEntry = (adminUser) => {
    return {
        _id: adminUser._id,
        email: adminUser.email,
        userId: adminUser.userId,
        hash: adminUser.hash,
        salt: adminUser.salt,
        pwdResetToken: (adminUser.pwdResetToken)? adminUser.pwdResetToken: null,
        firstName: (adminUser.firstName)? adminUser.firstName : null,
        lastName: (adminUser.lastName)? adminUser.lastName: null,
        mobileNumber: (adminUser.mobileNumber)? adminUser.mobileNumber : null,
        creationDate: adminUser.creationDate,
        lastModified: adminUser.lastModified,
        lastLogin: (adminUser.lastLogin)? adminUser.lastLogin : null,
        isEmailVerified: adminUser.isEmailVerified,
        adminApprovalRequired: adminUser.adminApprovalRequired,
        isActive: adminUser.isActive
    };
};

module.exports = buildSerializer(_serializeSingleObjEntry);