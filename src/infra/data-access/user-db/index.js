const dbChoice = require('../_shared/dbAccessModuleSelector')();
let {
    listUsers,
    findUserByEmail,
    findUserByUserId,
    addUser,
    updateUserAddresses,
    updateUserEmail,
    deleteUserByEmail,
    dropAll
} = require(`./${dbChoice}`);

module.exports = {
    listUsers,
    findUserByEmail,
    findUserByUserId,
    addUser,
    updateUserAddresses,
    updateUserEmail,
    deleteUserByEmail,
    dropAll
};