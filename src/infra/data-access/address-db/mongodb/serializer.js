const buildSerializer = require('../../_shared/serializerBuilder');

const _serializeSingleObjEntry = (address) => {
    return {
        _id: address._id,
        user_id: address.user_id,
        firstName: address.firstName,
        lastName: address.lastName,
        mobileNumber: address.mobileNumber,
        postalCode: address.postalCode,
        houseNumber: address.houseNumber,
        houseNumberAdd: address.houseNumberAdd,
        streetName: address.streetName,
        city: address.city,
        province: address.province,
        country: address.country,
        creationDate: address.creationDate,
        lastModified: address.lastModified
    }
}

module.exports = buildSerializer(_serializeSingleObjEntry);