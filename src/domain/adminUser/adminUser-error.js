const typeErrors = Object.freeze({
    email: new Error('AdminUser object must have email as string'),
    userId: new Error('AdminUser object has invalid type at property: userId'),
    hash: new Error('AdminUser object has invalid type at property: hash'),
    salt: new Error('AdminUser object has invalid type at property: salt'),
    pwdResetToken: new Error('AdminUser object has invalid type at property: pwdResetToken'),
    firstName: new Error('AdminUser object must have firstName as string'),
    lastName: new Error('AdminUser object must have lastName as string'),
    mobileNumber: new Error('AdminUser object has invalid type at property: mobileNumber'),
    creationDate: new Error('AdminUser object has invalid type at property: mobileNumber'),
    lastModified: new Error('AdminUser object has invalid type at property: mobileNumber'),
    lastLogin: new Error('AdminUser object has invalid type at property: mobileNumber'),
    isEmailVerified: new Error('AdminUser object has invalid type at property: isEmailVerified'),
    adminApprovalRequired: new Error('AdminUser object has invalid type at property: adminApprovalRequired'),
    isActive: new Error('AdminUser object has invalid type at property: isActive'),
});

const genericErrors = Object.freeze({
    invalid_email: new Error('AdminUser object contain invalid email in email field: double check format of email'),
});

module.exports = {
    typeErrors: typeErrors,
    genericErrors: genericErrors
}