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

    test('adminUser object must have a firstName property', () => {
        let payload = copyObj(dummyData);

        delete payload.firstName;

        const adminUser = createAdminUserObj(payload);

        expect(adminUser instanceof Error).toBe(true);
        expect(adminUser.message).toBe(errors.typeErrors.firstName.message);
    });

    test('firstName property must be string', () => {
        let payload = copyObj(dummyData);

        payload.firstName = 0;

        const adminUser = createAdminUserObj(payload);

        expect(adminUser instanceof Error).toBe(true);
        expect(adminUser.message).toBe(errors.typeErrors.firstName.message);
    });

    test('adminUser object must have a lastName property', () => {
        let payload = copyObj(dummyData);

        delete payload.lastName;

        const adminUser = createAdminUserObj(payload);

        expect(adminUser instanceof Error).toBe(true);
        expect(adminUser.message).toBe(errors.typeErrors.lastName.message);
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