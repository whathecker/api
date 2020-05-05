const userDB = require('../index');
let mockUsers = require('./_mock');

describe('Test database access layer of user object', () => {

    beforeEach(async () => {
        await userDB.dropAll();

        await userDB.addUser(mockUsers[0]);
        await userDB.addUser(mockUsers[1]);
    });

    afterAll(async () => {
        await userDB.dropAll();
    });

    test('list all users', async () => {
        const users = await userDB.listUsers();
        expect(users).toHaveLength(2);
    });

    test('find user by email', async () => {
        const email = mockUsers[0].email;

        const user = await userDB.findUserByEmail(email);

        const {_id, ...rest} = user;

        expect(rest).toEqual(mockUsers[0]);
    });

    test('find user by userId', async () => {
        const userId = mockUsers[1].userId;

        const user = await userDB.findUserByUserId(userId);

        const {_id, ...rest} = user;

        expect(rest).toEqual(mockUsers[1]);
    });

    test('add a new user', async () => {
        const payload = {
            email: "yunsoo.oh.kr@gmail.com",
            userId: "3",
            hash: " ",
            salt: " ",
            firstName: "Yunsoo",
            lastName: "Oh",
            mobileNumber: "06151516",
            addresses: ["4"],
            defaultShippingAddress: "4",
            defaultBillingAddress: "4",
            defaultBillingOption: "pm_12360",
            billingOptions: ["pm_12360"],
            subscriptions: ["ECSBNL1272839160"],
            orders: ["ECNL8092517650"],
            creationDate: new Date('December 14, 1996 03:24:00'),
            lastModified: new Date('December 24, 1996 03:24:00'),
            isEmailVerified: false,
            newsletterOptin: false
        };

        const newUser = await userDB.addUser(payload);

        const {_id, ...rest} = newUser;

        expect(rest).toEqual(payload);
    });

    test('delete a user by email', async () => {
        const email = mockUsers[0].email;

        const result = await userDB.deleteUserByEmail(email);
        const users = await userDB.listUsers();

        expect(result.status).toBe('success');
        expect(result.email).toEqual(email);
        expect(users).toHaveLength(1);
    });

    test('drop all users in db', async () => {
        await userDB.dropAll();
        const users = await userDB.listUsers();

        expect(users).toHaveLength(0);
    });
});