let {
    listAddressesByUserId,
    findAddressById,
    addAddress,
    updateAddress,
    deleteAddressById,
    dropAll
} = require('./memory');

module.exports = {
    listAddressesByUserId,
    findAddressById,
    addAddress,
    updateAddress,
    deleteAddressById,
    dropAll
};