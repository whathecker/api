const adminUserDB = require('../index');
let mockAdminUsers = require('./_mock');

describe('Test database access layer of adminUser object', () => {
    
    const _userId_holder = {
        0: null,
        1: null
    };

    beforeEach(async () => {
        await adminUserDB.dropAll();

        const adminUser = await adminUserDB.addAdminUser(mockAdminUsers[0]);
        const adminUser2 = await adminUserDB.addAdminUser(mockAdminUsers[1]);

        _userId_holder[0] = adminUser.userId;
        _userId_holder[1] = adminUser2.userId;
    });

    afterAll(async () => {
        await adminUserDB.dropAll();
    });

    test('list all admin users', async () => {
        const adminUsers = await adminUserDB.listAdminUsers();
        expect(adminUsers).toHaveLength(2);
    });

    test('find admin user by email', async () => {
        const email = mockAdminUsers[0].email;

        const adminUser = await adminUserDB.findAdminUserByEmail(email);

        const {_id, userId, mobileNumber, lastLogin, pwdResetToken, ...rest} = adminUser;

        expect(rest).toEqual(mockAdminUsers[0]);
    });

    test('find admin user by userId', async () => {
        const id = _userId_holder[1];

        const adminUser = await adminUserDB.findAdminUserByUserId(id);

        const {_id, userId, mobileNumber, lastLogin, pwdResetToken, ...rest} = adminUser;

        expect(rest).toEqual(mockAdminUsers[1]);
    });

    test('add a new admin user', async () => {
        const payload = {
            email: "yunjae.oh.nl@hellochokchok.com",
            firstName: "Yunjae",
            lastName: "Oh",
            hash: " ",
            salt: " ",
            isEmailVerified: false,
            adminApprovalRequired: true,
            isActive: false,
            creationDate: new Date('December 14, 1998 03:24:00'),
            lastModified: new Date('December 24, 1998 03:24:00'),
        };

        const newAdminUser = await adminUserDB.addAdminUser(payload);

        const {_id, userId, mobileNumber, lastLogin, pwdResetToken, ...rest} = newAdminUser;

        expect(rest).toEqual(payload);
    });

    test('delete a admin user by email', async () => {
        const email = mockAdminUsers[0].email;

        const result = await adminUserDB.deleteAdminUserByEmail(email);
        const adminUsers = await adminUserDB.listAdminUsers();

        expect(result.status).toBe("success");
        expect(result.email).toEqual(email);
        expect(adminUsers).toHaveLength(1);
    });

    test('drop all admin users in db', async () => {
        await adminUserDB.dropAll();
        const adminUsers = await adminUserDB.listAdminUsers();

        expect(adminUsers).toHaveLength(0);
    });
});