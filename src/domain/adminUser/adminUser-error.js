const typeErrors = Object.freeze({
    email: new Error('adminUser object must have email as string'),
    userId: new Error('adminUser object has invalid type at property: userId'),
    hash: new Error('adminUser object has invalid type at property: hash'),
    salt: new Error('adminUser object has invalid type at property: salt'),
    pwdResetToken: new Error('adminUser object has invalid type at property: pwdResetToken'),
    firstName: new Error('adminUser object must have firstName as string'),
    lastName: new Error('adminUser object must have lastName as string'),
    mobileNumber: new Error('adminUser object has invalid type at property: mobileNumber'),
    creationDate: new Error('adminUser object has invalid type at property: mobileNumber'),
    lastModified: new Error('adminUser object has invalid type at property: mobileNumber'),
    lastLogin: new Error('adminUser object has invalid type at property: mobileNumber'),
    isEmailVerified: new Error('adminUser object has invalid type at property: isEmailVerified'),
    adminApprovalRequired: new Error('adminUser object has invalid type at property: adminApprovalRequired'),
    isActive: new Error('adminUser object has invalid type at property: isActive'),
});

const genericErrors = Object.freeze({

});

module.exports = {
    typeErrors: typeErrors,
    genericErrors: genericErrors
}