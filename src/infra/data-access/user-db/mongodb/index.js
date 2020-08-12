const User = require('../../../db/mongodb/models/user');
const createUserObj = require('../../../../domain/user');
const serializer = require('./serializer');

const listUsers = async () => {
    const users = await User.find();
    return Promise.resolve(serializer(users));
};

const findUserByEmail = async (email) => {
    const user = await User.findOne({ email: email });

    if (!user) {
        return Promise.reject({
            status: "fail",
            reason: "user not found"
        });
    }

    return Promise.resolve(serializer(user));
};

const findUserByUserId = async (userId) => {
    const user = await User.findOne({ userId: userId });

    if (!user) {
        return Promise.reject({
            status: "fail",
            reason: "user not found"
        });
    }

    return Promise.resolve(serializer(user));
};

const addUser = async (payload) => {

    const userObj = createUserObj(payload);

    if (userObj instanceof Error) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: userObj
        });
    }

    try {
        await _isEmailUnique(userObj.email);
        await _isUserIdUnique(userObj.userId);
    }
    catch (err) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: err
        });
    }

    const newUser = await User.create(userObj);

    return Promise.resolve(serializer(newUser));
};

async function _isEmailUnique (email) {
    try {
        await findUserByEmail(email);
    } catch (err) {
        return;
    }

    throw new Error('db access for user object failed: email must be unique');
};

async function _isUserIdUnique (userId) {
    try {
        await findUserByUserId(userId);
    } catch (err) {
        return;
    }

    throw new Error('db access for user object failed: userId must be unique');
};

const updateUserAddresses = async () => {

};

const deleteUserByEmail = async (email) => {
    const removedUser = await User.findOneAndRemove({
        email: email
    });

    if (!removedUser) {
        return Promise.reject({
            status: "fail",
            reason: "user not found"
        });
    }

    if (removedUser) {
        return Promise.resolve({
            email: removedUser.email,
            status: "success"
        });
    }
};

const dropAll = async () => {
    return User.remove();
};

module.exports = {
    listUsers,
    findUserByEmail,
    findUserByUserId,
    addUser,
    updateUserAddresses,
    deleteUserByEmail,
    dropAll
};