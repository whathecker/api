const errors = require('./adminUser-error');
const adminUserSchema = require('./adminUser-schema');
const validator = require('../_shared/validator')(adminUserSchema);
const buildCreateAdminUserObj = require('./adminUser');

const createAdminUserObj = buildCreateAdminUserObj(validator);

const dummyData = {
    email: "yunjae.oh@hellochokchok.com",
    userId: 'userId',
    hash: 'somehash',
    salt: 'somesalt',
    firstName: "Yunjae",
    lastName: "Oh",
    mobileNumber: "06151515",
    creationDate: new Date('December 14, 1995 03:24:00'),
    lastModified: new Date('December 24, 1995 03:24:00'),
    lastLogin: new Date('December 24, 1995 03:24:00'),
    isEmailVerified: true,
    adminApprovalRequired: true,
    isActive: true
};

function copyObj(obj) {
    return JSON.parse(JSON.stringify(obj));
}

describe('Make AdminUser object', () => {

    test('AdminUser object is created - without optional fields', () => {
        let payload = copyObj(dummyData);

        const userId = payload.userId;
        const hash = payload.hash;
        const salt = payload.salt;
        
        const firstName = payload.firstName;
        const lastName = payload.lastName;
        const creationDate = payload.creationDate;
        const lastModified = payload.lastModified;
        const lastLogin = payload.lastLogin;
        const isEmailVerified = payload.isEmailVerified;
        const adminApprovalRequired = payload.adminApprovalRequired;
        const isActive = payload.isActive;

        delete payload.firstName;
        delete payload.lastName;
        delete payload.userId;
        delete payload.hash;
        delete payload.salt;
        delete payload.pwdResetToken;
        delete payload.mobileNumber;
        delete payload.creationDate;
        delete payload.lastModified;
        delete payload.lastLogin;
        delete payload.isEmailVerified;
        delete payload.adminApprovalRequired;
        delete payload.isActive;

        const adminUser = createAdminUserObj(payload);

        expect(adminUser.email).toBe(payload.email);


        expect(adminUser.firstName).not.toBe(firstName);
        expect(adminUser.lastName).not.toBe(lastName);
        expect(adminUser.userId).not.toBe(userId);
        expect(adminUser.hash).not.toBe(hash);
        expect(adminUser.salt).not.toBe(salt);
        expect(adminUser.creationDate).not.toBe(creationDate);
        expect(adminUser.lastModified).not.toBe(lastModified);
        expect(adminUser.lastLogin).not.toBe(lastLogin);
        expect(adminUser.isEmailVerified).not.toBe(isEmailVerified);
        expect(adminUser.adminApprovalRequired).not.toBe(adminApprovalRequired);
        expect(adminUser.isActive).not.toBe(isActive);
    });

    test('AdminUser object is created - with all fields', () => {
        let payload = copyObj(dummyData);
        payload.pwdResetToken = "token"

        const adminUser = createAdminUserObj(payload);

        expect(adminUser.email).toBe(payload.email);
        expect(adminUser.firstName).toBe(payload.firstName);
        expect(adminUser.lastName).toBe(payload.lastName);
        expect(adminUser.userId).toBe(payload.userId);
        expect(adminUser.hash).toBe(payload.hash);
        expect(adminUser.salt).toBe(payload.salt);
        expect(adminUser.pwdResetToken).toBe(payload.pwdResetToken);
        expect(adminUser.creationDate).toBe(payload.creationDate);
        expect(adminUser.lastModified).toBe(payload.lastModified);
        expect(adminUser.lastLogin).toBe(payload.lastLogin);
        expect(adminUser.isEmailVerified).toBe(payload.isEmailVerified);
        expect(adminUser.adminApprovalRequired).toBe(payload.adminApprovalRequired);
        expect(adminUser.isActive).toBe(payload.isActive);
    });

    test('invalid email', () => {
        let payload = copyObj(dummyData);
        payload.email = "invalidemail.com";

        const adminUser = createAdminUserObj(payload);

        expect(adminUser instanceof Error).toBe(true);
        expect(adminUser.message).toBe(errors.genericErrors.invalid_email.message);
    });

});

describe('Type checking: adminUser object', () => {

    test('adminUser object must have a email property', () => {
        let payload = copyObj(dummyData);

        delete payload.email;

        const adminUser = createAdminUserObj(payload);

        expect(adminUser instanceof Error).toBe(true);
        expect(adminUser.message).toBe(errors.typeErrors.email.message);
    });

    test('email property must be string', () => {
        let payload = copyObj(dummyData);

        payload.email = 0;

        const adminUser = createAdminUserObj(payload);

        expect(adminUser instanceof Error).toBe(true);
        expect(adminUser.message).toBe(errors.typeErrors.email.message);
    });

    test('userId property must be string if exist', () => {
        let payload = copyObj(dummyData);

        payload.userId = 0;

        const adminUser = createAdminUserObj(payload);

        expect(adminUser instanceof Error).toBe(true);
        expect(adminUser.message).toBe(errors.typeErrors.userId.message);
    });

    test('hash property must be string if exist', () => {
        let payload = copyObj(dummyData);

        payload.hash = 0;

        const adminUser = createAdminUserObj(payload);

        expect(adminUser instanceof Error).toBe(true);
        expect(adminUser.message).toBe(errors.typeErrors.hash.message);
    });

    test('salt property must be string if exist', () => {
        let payload = copyObj(dummyData);

        payload.salt = 0;

        const adminUser = createAdminUserObj(payload);

        expect(adminUser instanceof Error).toBe(true);
        expect(adminUser.message).toBe(errors.typeErrors.salt.message);
    });

    test('pwdResetToken property must be string if exist', () => {
        let payload = copyObj(dummyData);

        payload.pwdResetToken = 0;

        const adminUser = createAdminUserObj(payload);

        expect(adminUser instanceof Error).toBe(true);
        expect(adminUser.message).toBe(errors.typeErrors.pwdResetToken.message);
    });

    test('firstName property must be string', () => {
        let payload = copyObj(dummyData);

        payload.firstName = 0;

        const adminUser = createAdminUserObj(payload);

        expect(adminUser instanceof Error).toBe(true);
        expect(adminUser.message).toBe(errors.typeErrors.firstName.message);
    });

    test('lastName property must be string', () => {
        let payload = copyObj(dummyData);

        payload.lastName = 0;

        const adminUser = createAdminUserObj(payload);

        expect(adminUser instanceof Error).toBe(true);
        expect(adminUser.message).toBe(errors.typeErrors.lastName.message);
    });

    test('mobileNumber property must be string if exist', () => {
        let payload = copyObj(dummyData);

        payload.mobileNumber = true;

        const adminUser = createAdminUserObj(payload);

        expect(adminUser instanceof Error).toBe(true);
        expect(adminUser.message).toBe(errors.typeErrors.mobileNumber.message);
    });

    test('creationDate property must be date if exist', () => {
        let payload = copyObj(dummyData);

        payload.creationDate = true;

        const adminUser = createAdminUserObj(payload);

        expect(adminUser instanceof Error).toBe(true);
        expect(adminUser.message).toBe(errors.typeErrors.creationDate.message);
    });

    test('lastModified property must be date if exist', () => {
        let payload = copyObj(dummyData);

        payload.lastModified = true;

        const adminUser = createAdminUserObj(payload);

        expect(adminUser instanceof Error).toBe(true);
        expect(adminUser.message).toBe(errors.typeErrors.lastModified.message);
    });

    test('lastLogin property must be date if exist', () => {
        let payload = copyObj(dummyData);

        payload.lastLogin = true;

        const adminUser = createAdminUserObj(payload);

        expect(adminUser instanceof Error).toBe(true);
        expect(adminUser.message).toBe(errors.typeErrors.lastLogin.message);
    });

    test('isEmailVerified property must be boolean if exist', () => {
        let payload = copyObj(dummyData);

        payload.isEmailVerified = 'someodd text';

        const adminUser = createAdminUserObj(payload);

        expect(adminUser instanceof Error).toBe(true);
        expect(adminUser.message).toBe(errors.typeErrors.isEmailVerified.message);
    });

    test('adminApprovalRequired property must be boolean if exist', () => {
        let payload = copyObj(dummyData);

        payload.adminApprovalRequired = 'some odd text';

        const adminUser = createAdminUserObj(payload);

        expect(adminUser instanceof Error).toBe(true);
        expect(adminUser.message).toBe(errors.typeErrors.adminApprovalRequired.message);
    });

    test('isActive property must be boolean if exist', () => {
        let payload = copyObj(dummyData);

        payload.isActive = 'some odd text';

        const adminUser = createAdminUserObj(payload);

        expect(adminUser instanceof Error).toBe(true);
        expect(adminUser.message).toBe(errors.typeErrors.isActive.message);
    });
});