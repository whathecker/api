let ADMINUSERS = require('../../../db/memory/adminUser');
const createAdminUser = require('../../../../domain/adminUser');

const listAdminUsers = () => {
    return Promise.resolve(ADMINUSERS);
};

const findAdminUserByEmail = (email) => {
    const adminUser = ADMINUSERS.find(user => {
        return user.email === email;
    });

    if (!adminUser) {
        return Promise.reject({
            status: "fail",
            reason: "adminUser not found"
        });
    }

    return Promise.resolve(adminUser);
};

const findAdminUserByUserId = (userId) => {
    const adminUser = ADMINUSERS.find(user => {
        return user.userId === userId;
    });

    if (!adminUser) {
        return Promise.reject({
            status: "fail",
            reason: "adminUser not found"
        });
    }

    return Promise.resolve(adminUser);
};

const addAdminUser = async (payload) => {

    const adminUserObj = createAdminUser(payload);

    if (adminUserObj instanceof Error) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: adminUserObj
        });
    }

    try {
        await _isEmailUnique(adminUserObj.email);
        await _isUserIdUnique(adminUserObj.userId);
    }
    catch (err) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: err
        });
    }

    const new_id = ADMINUSERS.length + 1;

    const newAdminUser = {
        _id: new_id.toString(),
        ... adminUserObj
    };
    ADMINUSERS.push(newAdminUser);
    
    return Promise.resolve(ADMINUSERS[ADMINUSERS.length - 1]);
};

async function _isEmailUnique (email) {
    try {
        await findAdminUserByEmail(email);
    } catch (err) {
        return;
    }
    throw new Error('db access for adminUser object failed: email must be unique');    
};

async function _isUserIdUnique (userId) {
    try {
        await findAdminUserByUserId(userId);
    } catch (err) {
        return;
    }
    throw new Error('db access for adminUser object failed: userId must be unique');
};

const deleteAdminUserByEmail = async (email) => {
    const adminUser = await findAdminUserByEmail(email);

    const { status } = adminUser;

    if (status === "fail") {
        return Promise.reject({
            status: "fail",
            reason: "user not found"
        });
    }

    let deletedAdminUser;
    ADMINUSERS = ADMINUSERS.filter(user => {

        if (user.email !== email) {
            return true;
        }

        if (user.email === email) {
            deletedAdminUser = user;
            return false;
        }
    });

    return Promise.resolve({
        email: deletedAdminUser.email,
        status: "success"
    });

};

const dropAll = () => {
    ADMINUSERS = [];
    return Promise.resolve(ADMINUSERS);
};

module.exports = {
    listAdminUsers,
    findAdminUserByEmail,
    findAdminUserByUserId,
    addAdminUser,
    deleteAdminUserByEmail,
    dropAll
};