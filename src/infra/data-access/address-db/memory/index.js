let ADDRESSES = require('../../../db/memory/address');
const createAddressObj = require('../../../../domain/address');

const listAddressesByUserId = (user_id) => {
    const result = ADDRESSES.filter(address => address.user_id === user_id );
    return Promise.resolve(result);
};

const findAddressById = (address_id) => {
    const address = ADDRESSES.find(address => {
        return address._id === address_id;
    });

    if (!address) {
        return Promise.reject({
            status: "fail",
            reason: "address not found",
        });
    }

    return Promise.resolve(address);
}

const addAddress = (input) => {

    const address = createAddressObj(input);

    if (address instanceof Error) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: address
        });
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

const deleteAddressById = async (address_id) => {

    return findAddressById(address_id).then(address => {

        ADDRESSES = ADDRESSES.filter(address => address._id === address_id);
        
        return Promise.resolve({
            _id: address._id,
            status: "success"
        });

    }).catch(err => {
        return Promise.reject(err);
    });

};

const dropAll = () => {
    ADDRESSES = [];
    return Promise.resolve(ADDRESSES);
};

module.exports = {
    listAddressesByUserId,
    findAddressById,
    addAddress,
    updateAddress,
    deleteAddressById,
    dropAll
};