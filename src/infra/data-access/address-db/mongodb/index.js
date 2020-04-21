let Address = require('../../../db/mongodb/models/address');
let createAddressObj = require('../../../../domain/address');

const listAddressesByUserId = async (user_id) => {
    const addresses = await Address.find({ user_id: user_id });
    return Promise.resolve(addresses);
};

const findAddressById = (address_id) => {

};

const addAddress = async (payload) => {
    
    const address = createAddressObj(payload);

    if (address instanceof Error) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: address
        });
    }

    const newAddress = await Address.create(address);

    return Promise.resolve(newAddress);
};

const updateAddress = (address_id, payload) => {

};

const deleteAddressById = (address_id) => {

};

const dropAll = () => {
    return Address.remove();
};

module.exports = {
    listAddressesByUserId,
    findAddressById,
    addAddress,
    updateAddress,
    deleteAddressById,
    dropAll
};