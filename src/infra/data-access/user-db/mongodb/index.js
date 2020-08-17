const User = require('../../../db/mongodb/models/user');
const createUserObj = require('../../../../domain/user');
const serializer = require('./serializer');
const helpers = require('../../_shared/helpers');

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

const updateUserAddresses = async (userId, addresses = []) => {
    const user = await findUserByUserId(userId);
    const { status, _id, ...rest } = user;

    if (status === "fail") {
        return Promise.reject({
            status: "fail",
            reason: "user not found"
        });
    }

    let updatedPayload = rest;
    updatedPayload.addresses = addresses;
    updatedPayload = helpers.removeNullsFromObject(updatedPayload);

    const userObj = createUserObj(updatedPayload);

    if (userObj instanceof Error) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: userObj
        });
    }

    const updatedUser = await User.findOneAndUpdate({ 
        userId: updatedPayload.userId 
    }, userObj, { new: true });

    return Promise.resolve(serializer(updatedUser));
};

const updateUserEmail = async (userId, email) => {
    const userWithNewEmail = await User.findOne({ email: email });

    if (userWithNewEmail) {
        return Promise.reject({
            status: "fail",
            reason: "email address is already in used"
        });
    }

    const user = await findUserByUserId(userId);
    const { status, _id, ...rest } = user;

    if (status === "fail") {
        return Promise.reject({
            status: "fail",
            reason: "user not found"
        });
    }

    let updatedPayload = rest;
    updatedPayload.email = email;
    updatedPayload = helpers.removeNullsFromObject(updatedPayload);

    const userObj = createUserObj(updatedPayload);

    if (userObj instanceof Error) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: userObj
        });
    }

    const updatedUser = await User.findOneAndUpdate({ 
        userId: updatedPayload.userId 
    }, userObj, { new: true });

    return Promise.resolve(serializer(updatedUser));
};

const updateUserContactInfo = async (userId, {
    firstName,
    lastName,
    mobileNumber
} = {}) => {

    const user = await findUserByUserId(userId);
    const { status, _id, ...rest } = user;

    if (status === "fail") {
        return Promise.reject({
            status: "fail",
            reason: "user not found"
        });
    }

    let updatedPayload = rest;
    updatedPayload.firstName = firstName;
    updatedPayload.lastName = lastName;
    (mobileNumber)? updatedPayload.mobileNumber = mobileNumber : null;
    updatedPayload = helpers.removeNullsFromObject(updatedPayload);

    const userObj = createUserObj(updatedPayload);

    if (userObj instanceof Error) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: userObj
        });
    }

    const updatedUser = await User.findOneAndUpdate({ 
        userId: updatedPayload.userId 
    }, userObj, { new: true });

    return Promise.resolve(serializer(updatedUser));
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
    updateUserEmail,
    updateUserAddresses,
    updateUserContactInfo,
    deleteUserByEmail,
    dropAll
};