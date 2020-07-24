const lookupServices = {
    nl: require('./country/nl')
}

const _getLookupServicesForCountry = (countryCode) => {
    const loweredIsoCode = countryCode.toLowerCase();
    const service = lookupServices[loweredIsoCode];

    if (!service) {
        throw new Error("address lookup request failed: invalid countryCode or country is not supported");
    }

    return service;
};

const lookupAddress = async (countryCode, payload = {}) => {

    try {
        const lookup = _getLookupServicesForCountry(countryCode);

        const lookupResult = await lookup.getAddressDetail(payload);
        
        return Promise.resolve({
            status: lookupResult.status,
            result: lookupResult.result,
            address: lookupResult.address
        });

    } catch (exception) {
        if (exception.result === "error") {
            return Promise.reject(exception);
        } else {
            return Promise.reject({
                status: "fail",
                result: "error",
                error: exception.message
            });
        }
    }
}

module.exports = {
    lookupAddress
}