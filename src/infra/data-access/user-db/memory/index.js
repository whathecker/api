let USERS = require('../../../db/memory/user');
const createUserObj = require('../../../../domain/user');

const listUsers = () => {
    return Promise.resolve(USERS);
};

const findUserByEmail = (email) => {
    const user = USERS.find(user => {
        return user.email === email;
    });

    if (!user) {
        return Promise.reject({
            status: "fail",
            reason: "user not found"
        });
    }

    return Promise.resolve(user);
};

const findUserByUserId = (userId) => {
    const user = USERS.find(user => {
        return user.userId === userId;
    });

    if (!user) {
        return Promise.reject({
            status: "fail",
            reason: "user not found"
        });
    }

    return Promise.resolve(user);
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

    const new_id =  USERS.length + 1;

    const newUser = {
        _id: new_id.toString(),
        ...userObj
    };
    USERS.push(newUser);

    return Promise.resolve(USERS[USERS.length - 1]);
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

const deleteUserByEmail = async (email) => {
    const user = await findUserByEmail(email);

    const { status } = user;

    if (status === "fail") {
        return Promise.reject({
            status: "fail",
            reason: "user not found"
        });
    }

    let deletedUser;
    USERS = USERS.filter(user => {

        if (user.email !== email) {
            return true;
        }

        if (user.email === email) {
            deletedUser = user;
            return false;
        }
    });

    return Promise.resolve({
        email: deletedUser.email,
        status: "success"
    });
};

const dropAll = () => {
    USERS = [];
    return Promise.resolve(USERS);
};

module.exports = {
    listUsers,
    findUserByEmail,
    findUserByUserId,
    addUser,
    deleteUserByEmail,
    dropAll
};