let ADDRESSES = require('../../../db/memory/address');
const createAddressObj = require('../../../../domain/address');

const listAddressesByUserId = (user_id) => {
    const addresses = ADDRESSES.filter(address => address.user_id === user_id );
    return Promise.resolve(addresses);
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

const addAddress = (payload) => {

    const address = createAddressObj(payload);

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

    return Promise.resolve(ADDRESSES[ADDRESSES.length - 1]);
};

const updateAddress = (address_id, payload) => {

    return findAddressById(address_id).then(address => {

        const updatedAddress = createAddressObj(payload);

        if (updatedAddress instanceof Error) {
            return Promise.reject({
                status: "fail",
                reason: "error",
                error: updatedAddress
            });
        }

        const updated = {
            _id: address._id,
            user_id: updatedAddress.user_id,
            firstName: updatedAddress.firstName,
            lastName: updatedAddress.lastName,
            mobileNumber: updatedAddress.mobileNumber,
            postalCode: updatedAddress.postalCode,
            houseNumber: updatedAddress.houseNumber,
            houseNumberAdd : updatedAddress.houseNumberAdd,
            streetName: updatedAddress.streetName,
            city: updatedAddress.city,
            province: updatedAddress.province,
            country: updatedAddress.country
        };
        ADDRESSES[address._id] = updated;

        return Promise.resolve(ADDRESSES[address._id]);

    }).catch(err => {
        return Promise.reject(err);
    });
};

const deleteAddressById = async (address_id) => {

    const address = await findAddressById(address_id);

    const { status } = address;

    if (status === "fail") {
        return Promise.reject({
            status: "fail",
            reason: "address not found"
        });
    }

    ADDRESSES = ADDRESSES.filter(address => address._id !== address_id);
    return Promise.resolve({
        _id: address._id,
        status: "success"
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