const Address = require('../../../db/mongodb/models/address');
const serializer = require('./serializer');
const createAddressObj = require('../../../../domain/address');

const listAddressesByUserId = async (user_id) => {
    const addresses = await Address.find({ user_id: user_id });
    return Promise.resolve(serializer(addresses));
};

const findAddressById = async (address_id) => {
    const address = await Address.findById(address_id);

    if (!address) {
        return Promise.reject({
            status: "fail",
            reason: "address not found"
        });
    }
    return Promise.resolve(serializer(address));
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

    return Promise.resolve(serializer(newAddress));
};

const updateAddress = async (address_id, payload) => {

    const update = createAddressObj(payload);

    if (update instanceof Error) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: update
        });
    }

    const updatedAddress = await Address.findByIdAndUpdate(address_id, update, {
        new: true
    });

    return Promise.resolve(serializer(updatedAddress));
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