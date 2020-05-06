const dbChoice = require('../_shared/dbAccessModuleSelector')();
let {
    listAdminUsers,
    findAdminUserByEmail,
    findAdminUserByUserId,
    addAdminUser,
    deleteAdminUserByEmail,
    dropAll
} = require(`./${dbChoice}`);

module.exports = {
    listAdminUsers,
    findAdminUserByEmail,
    findAdminUserByUserId,
    addAdminUser,
    deleteAdminUserByEmail,
    dropAll
};