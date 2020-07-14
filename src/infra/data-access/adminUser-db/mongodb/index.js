const AdminUser = require('../../../db/mongodb/models/adminUser');
const createAdminUser = require('../../../../domain/adminUser');
const serializer = require('./serializer');

const listAdminUsers = async () => {
    const adminUsers = await AdminUser.find();
    return Promise.resolve(serializer(adminUsers));
};

const findAdminUserByEmail = async (email) => {
    const adminUser = await AdminUser.findOne({ email: email });

    if (!adminUser) {
        return Promise.reject({
            status: "fail",
            reason: "adminUser not found"
        });
    }

    return Promise.resolve(serializer(adminUser));
};

const findAdminUserByUserId = async (userId) => {
    const adminUser = await AdminUser.findOne({ userId: userId });

    if (!adminUser) {
        return Promise.reject({
            status: "fail",
            reason: "adminUser not found"
        });
    }

    return Promise.resolve(serializer(adminUser));
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

    const newAdminUser = await AdminUser.create(adminUserObj);

    return Promise.resolve(serializer(newAdminUser));
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
    const removedAdminUser = await AdminUser.findOneAndRemove({
        email: email
    });

    if (!removedAdminUser) {
        return Promise.reject({
            status: "fail",
            reason: "adminUser not found"
        });
    }

    if (removedAdminUser) {
        return Promise.resolve({
            email: removedAdminUser.email,
            status: "success"
        });
    }
};

const dropAll = async () => {
    return AdminUser.remove();
};

module.exports = {
    listAdminUsers,
    findAdminUserByEmail,
    findAdminUserByUserId,
    addAdminUser,
    deleteAdminUserByEmail,
    dropAll
};