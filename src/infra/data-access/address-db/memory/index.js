let ADDRESSES = require('../../../db/memory/address');
const createAddressObj = require('../../../../domain/address');

const listAddressesByUserId = (user_id) => {
    const result = ADDRESSES.filter(address => address.user_id === user_id );
    return Promise.resolve(result);
};

const addAddress = (input) => {

    const address = createAddressObj(input);

    if (address instanceof Error) {
        return Promise.reject(address);
    }

    const new_id = ADDRESSES.length + 1;

    const newAddress = {
        _id: new_id.toString(),
        user_id: address.user_id,
        firstName: address.firstName,
        lastName: address.lastName,
        mobileNumber: address.mobileNumber,
        postalCode: address.postalCode,
        houseNumber: address.houseNumber,
        houseNumberAdd : address.houseNumberAdd,
        streetName: address.streetName,
        city: address.city,
        province: address.province,
        country: address.country
    };
    ADDRESSES.push(newAddress);

    return Promise.resolve(newAddress);
};

const updateAddress = (address_id) => {

};

const deleteAddressById = (address_id) => {
    let result = {};

    const address = ADDRESSES.find(address => address._id === address_id);

    if (!address) {
        result = { 
            status: "fail",
            reason: "unknown_id" 
        };
    }

    if (address._id === address_id) {
        ADDRESSES = ADDRESSES.filter(address => address._id === address_id);
        result = {
            _id: address_id,
            status: "success"
        }
    }

    return Promise.resolve(result);
};

const dropAll = () => {
    ADDRESSES = [];
    return Promise.resolve(ADDRESSES);
};

module.exports = {
    listAddressesByUserId,
    addAddress,
    updateAddress,
    deleteAddressById,
    dropAll
};