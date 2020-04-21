let Address = require('../../../db/mongodb/models/address');
let createAddressObj = require('../../../../domain/address');

const listAddressesByUserId = async (user_id) => {
    const addresses = await Address.find({ user_id: user_id });
    return Promise.resolve(addresses);
};

const findAddressById = async (address_id) => {
    const address = await Address.findById(address_id);

    if (!address) {
        return Promise.reject({
            status: "fail",
            reason: "address not found"
        });
    }
    return Promise.resolve(address);
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

const updateAddress = async (address_id, payload) => {

    const updatedAddressObj = createAddressObj(payload);

    if (updatedAddress instanceof Error) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: updatedAddressObj
        });
    }

    const updatedAddress = await Address.findByIdAndUpdate(address_id, updatedAddressObj);
    
    return Promise.resolve(updateAddress);
};

const deleteAddressById = async (address_id) => {
    const removedAddress = await Address.findByIdAndRemove(address_id);

    if (!removedAddress) {
        return Promise.reject({
            status: "failed",
            reason: "address not found"
        });
    }

    if (removedAddress) {
        return Promise.resolve({
            _id: removedAddress._id,
            status: "success"
        });
    };
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