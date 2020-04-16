const AdminUserFactory = require('./index');

describe('Test AdminUserFactory', () => {

    test('createAdminUserId must return valid userId for admin', () => {
        const result = AdminUserFactory.createAdminUserId();

        expect(result).toHaveLength(10);
        expect(result.slice(0,5)).toBe('ADMIN');
    });
});