let buildCreateAddressObj = function(addressValidator) {
    return({
        user,
        firstName,
        lastName,
        mobileNumber,
        postalCode,
        houseNumber,
        houseNumberAdd,
        streetName,
        city,
        province,
        country,
        creationDate,
        lastModified
    } = {}) => {

        const payload = {
            user,
            firstName,
            lastName,
            mobileNumber,
            postalCode,
            houseNumber,
            houseNumberAdd,
            streetName,
            city,
            province,
            country,
            creationDate,
            lastModified
        };

        const result = addressValidator(payload);

        if (result instanceof Error) {
            return result;
        }
        return 'create object';
    }
}

module.exports = buildCreateAddressObj;