const dbChoice = require('../_shared/dbAccessModuleSelector')();
let {
    listAddressesByUserId,
    findAddressById,
    addAddress,
    updateAddress,
    deleteAddressById,
    dropAll
} = require(`./${dbChoice}`);

module.exports = {
    listAddressesByUserId,
    findAddressById,
    addAddress,
    updateAddress,
    deleteAddressById,
    dropAll
};