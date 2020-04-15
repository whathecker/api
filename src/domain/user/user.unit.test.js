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

describe('Make User object', () => {

    test('User object is created - without optional fields', () => {
        let payload = copyObj(dummyData);

        const hash = payload.hash;
        const salt = payload.salt;
        const mobileNumber = payload.mobileNumber;
        const addresses = payload.addresses;
        const defaultBillingAddress = payload.defaultBillingAddress;
        const defaultShippingAddress = payload.defaultShippingAddress;
        const billingOptions = payload.billingOptions;
        const subscriptions = payload.subscriptions;
        const orders = payload.orders;
        const creationDate = payload.creationDate;
        const lastModified = payload.lastModified;
        const isEmailVerified = payload.isEmailVerified;
        const newsletterOptin = payload.newsletterOptin;
        const lastLogin = payload.lastLogin;

        delete payload.hash;
        delete payload.salt;
        delete payload.mobileNumber;
        delete payload.addresses;
        delete payload.defaultBillingAddress;
        delete payload.defaultShippingAddress;
        delete payload.billingOptions;
        delete payload.subscriptions;
        delete payload.orders;
        delete payload.creationDate;
        delete payload.lastModified;
        delete payload.lastLogin;
        delete payload.isEmailVerified;
        delete payload.newsletterOptin;

        const user = createUserObj(payload);

        expect(user.email).toBe(payload.email);
        expect(user.userId).toBe(payload.userId);
        expect(user.firstName).toBe(payload.firstName);
        expect(user.lastName).toBe(payload.lastName);

        expect(user.hash).not.toBe(hash);
        expect(user.salt).not.toBe(salt);
        expect(user.mobileNumber).not.toBe(mobileNumber);
        expect(user.addresses).not.toBe(addresses);
        expect(user.defaultBillingAddress).not.toBe(defaultBillingAddress);
        expect(user.defaultShippingAddress).not.toBe(defaultShippingAddress);
        expect(user.billingOptions).not.toBe(billingOptions);
        expect(user.subscriptions).not.toBe(subscriptions);
        expect(user.orders).not.toBe(orders);
        expect(user.creationDate).not.toBe(creationDate);
        expect(user.lastModified).not.toBe(lastModified);
        expect(user.lastLogin).not.toBe(lastLogin);
        expect(user.isEmailVerified).not.toBe(isEmailVerified);
        expect(user.newsletterOptin).not.toBe(newsletterOptin);
    });

    test('User object is created with all fields', () => {
        let payload = copyObj(dummyData);

        const user = createUserObj(payload);

        expect(user.email).toBe(payload.email);
        expect(user.userId).toBe(payload.userId);
        expect(user.firstName).toBe(payload.firstName);
        expect(user.lastName).toBe(payload.lastName);

        expect(user.hash).toBe(payload.hash);
        expect(user.salt).toBe(payload.salt);
        expect(user.mobileNumber).toBe(payload.mobileNumber);
        expect(user.addresses).toBe(payload.addresses);
        expect(user.defaultBillingAddress).toBe(payload.defaultBillingAddress);
        expect(user.defaultShippingAddress).toBe(payload.defaultShippingAddress);
        expect(user.billingOptions).toBe(payload.billingOptions);
        expect(user.subscriptions).toBe(payload.subscriptions);
        expect(user.orders).toBe(payload.orders);
        expect(user.creationDate).toBe(payload.creationDate);
        expect(user.lastModified).toBe(payload.lastModified);
        expect(user.lastLogin).toBe(payload.lastLogin);
        expect(user.isEmailVerified).toBe(payload.isEmailVerified);
        expect(user.newsletterOptin).toBe(payload.newsletterOptin);
    });

    test('invalid email', () => {
        let payload = copyObj(dummyData);
        payload.email = "invalidemail.com";

        const user = createUserObj(payload);

        expect(user instanceof Error).toBe(true);
        expect(user.message).toBe(errors.genericErrors.invalid_email.message);
    });
});

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