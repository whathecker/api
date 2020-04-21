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

const serializer = (data) => {
    if (!data) {
        return null;
    }

    if (Array.isArray(data)) {
        return data.map(_serializeSingleObjEntry)
    }
    return _serializeSingleObjEntry(data);
}

module.exports = serializer;