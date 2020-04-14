const errors = require('./user-error');
const userSchema = require('./user-schema');
const validator = require('../_shared/validator')(userSchema);
const buildCreateUserObj = require('./user');

const createUserObj = buildCreateUserObj(validator);

const dummyData = {
    email: "test@testemail.com",
    userId: "test_user_id",
    hash: "testhashaskdqwoiwvw",
    salt: "testhasfvklsdfkwe",
    firstName: "yunjae",
    lastName: "oh",
    mobileNumber: "0612345678",
    addresses: [
        "address_id_1",
        "address_id_2",
        "address_id_3"
    ],
    defaultShippingAddress: "address_id_1",
    defaultBillingAddress: "address_id_2",
    billingOptions: [
        "billing_id_1",
        "billing_id_2",
        "billing_id_3"
    ],
    defaultBillingOption: "billing_id_1",
    subscriptions: [
        "subscription_id_1"
    ],
    orders: [
        "order_id_1",
    ],
    creationDate: new Date('December 14, 1995 03:24:00'),
    lastModified: new Date('December 24, 1995 03:24:00'),
    lastLogin: new Date('December 24, 1995 03:24:00'),
    isEmailVerified: true,
    newsletterOptin: true
};

function copyObj(obj) {
    return JSON.parse(JSON.stringify(obj));
}

describe('Type checking: user object', () => {

    test('User object must have a email property', () => {
        let payload = copyObj(dummyData);
        delete payload.email;

        const user = createUserObj(payload);

        expect(user instanceof Error).toBe(true);
        expect(user.message).toBe(errors.typeErrors.email.message);
    });

    test('email property must be string', () => {
        let payload = copyObj(dummyData);
        payload.email = 0;

        const user = createUserObj(payload);

        expect(user instanceof Error).toBe(true);
        expect(user.message).toBe(errors.typeErrors.email.message);
    });

    test('User object must have a userId property', () => {
        let payload = copyObj(dummyData);
        delete payload.userId;

        const user = createUserObj(payload);

        expect(user instanceof Error).toBe(true);
        expect(user.message).toBe(errors.typeErrors.userId.message);
    });

    test('userId property must a string', () => {
        let payload = copyObj(dummyData);
        payload.userId = 0;

        const user = createUserObj(payload);

        expect(user instanceof Error).toBe(true);
        expect(user.message).toBe(errors.typeErrors.userId.message);
    });

    test('hash property must be string if exist', ()=> {
        let payload = copyObj(dummyData);
        payload.hash = 0;

        const user = createUserObj(payload);

        expect(user instanceof Error).toBe(true);
        expect(user.message).toBe(errors.typeErrors.hash.message);
    });

    test('salt property must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.salt = 0;

        const user = createUserObj(payload);

        expect(user instanceof Error).toBe(true);
        expect(user.message).toBe(errors.typeErrors.salt.message);
    });

    test('pwdResetToken must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.pwdResetToken = 0;

        const user = createUserObj(payload);

        expect(user instanceof Error).toBe(true);
        expect(user.message).toBe(errors.typeErrors.pwdResetToken.message);
    });

    test('User object must have a firstName property', () => {
        let payload = copyObj(dummyData);
        delete payload.firstName;

        const user = createUserObj(payload);

        expect(user instanceof Error).toBe(true);
        expect(user.message).toBe(errors.typeErrors.firstName.message);
    });

    test('firstName property must be string', () => {
        let payload = copyObj(dummyData);
        payload.firstName = 0;

        const user = createUserObj(payload);

        expect(user instanceof Error).toBe(true);
        expect(user.message).toBe(errors.typeErrors.firstName.message);
    });

    test('User object must have a lastName property', () => {
        let payload = copyObj(dummyData);
        delete payload.lastName;

        const user = createUserObj(payload);

        expect(user instanceof Error).toBe(true);
        expect(user.message).toBe(errors.typeErrors.lastName.message);
    });

    test('lastName property must be string', () => {
        let payload = copyObj(dummyData);
        payload.lastName = 0;

        const user = createUserObj(payload);

        expect(user instanceof Error).toBe(true);
        expect(user.message).toBe(errors.typeErrors.lastName.message);
    });

    test('mobileNumber must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.mobileNumber = 0;

        const user = createUserObj(payload);

        expect(user instanceof Error).toBe(true);
        expect(user.message).toBe(errors.typeErrors.mobileNumber.message);
    });


    test('item in addresses array must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.addresses[0] = 0;

        const user = createUserObj(payload);

        expect(user instanceof Error).toBe(true);
        expect(user.message).toBe(errors.typeErrors.item_in_addresses.message);
    });

    test('defaultShippingAddress must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.defaultShippingAddress = 0;

        const user = createUserObj(payload);

        expect(user instanceof Error).toBe(true);
        expect(user.message).toBe(errors.typeErrors.defaultShippingAddress.message);
    });

    test('defaultBillingAddress must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.defaultBillingAddress = 0;

        const user = createUserObj(payload);

        expect(user instanceof Error).toBe(true);
        expect(user.message).toBe(errors.typeErrors.defaultBillingAddress.message);
    });

    test('item in billingOptions array must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.billingOptions[0] = 0;

        const user = createUserObj(payload);

        expect(user instanceof Error).toBe(true);
        expect(user.message).toBe(errors.typeErrors.item_in_billingOptions.message);
    });

    test('item in subscriptions array must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.subscriptions[0] = 0;

        const user = createUserObj(payload);

        expect(user instanceof Error).toBe(true);
        expect(user.message).toBe(errors.typeErrors.item_in_subscriptions.message);
    });

    test('item in orders array must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.orders[0] = 0;

        const user = createUserObj(payload);

        expect(user instanceof Error).toBe(true);
        expect(user.message).toBe(errors.typeErrors.item_in_orders.message);
    });

    test('creationDate must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.creationDate = 0;

        const user = createUserObj(payload);

        expect(user instanceof Error).toBe(true);
        expect(user.message).toBe(errors.typeErrors.creationDate.message);
    });

    test('lastModified must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.lastModified = 0;

        const user = createUserObj(payload);

        expect(user instanceof Error).toBe(true);
        expect(user.message).toBe(errors.typeErrors.lastModified.message);
    });

    test('lastLogin must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.lastLogin = 0;

        const user = createUserObj(payload);

        expect(user instanceof Error).toBe(true);
        expect(user.message).toBe(errors.typeErrors.lastLogin.message);
    });

    test('isEmailVerified must be boolean if exist', () => {
        let payload = copyObj(dummyData);
        payload.isEmailVerified = 0;

        const user = createUserObj(payload);

        expect(user instanceof Error).toBe(true);
        expect(user.message).toBe(errors.typeErrors.isEmailVerified.message);
    });

    test('newsletterOptin must be boolean if exist', () => {
        let payload = copyObj(dummyData);
        payload.newsletterOptin = 0;

        const user = createUserObj(payload);

        expect(user instanceof Error).toBe(true);
        expect(user.message).toBe(errors.typeErrors.newsletterOptin.message);
    });

});