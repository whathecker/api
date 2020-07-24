const _getLookupModuleForCountry = (countryCode) => {
    const countryCode = countryCode.toLowerCase();
    return require(`./country/${countryCode}`);
};

const lookupAddress = async (countryCode, payload = {}) => {

    try {
        const lookupModule = _getLookupModuleForCountry(countryCode);

        const lookupResult = await lookupModule.getAddressDetail(payload);
        
        return Promise.resolve({
            status: lookupResult.status,
            result: lookupResult.result,
            address: lookupResult.address
        });

    } catch (exception) {

        if (exception.result === "error") {
            return Promise.reject({
                status: exception.status,
                result: exception.result,
                error: exception.error
            });
        } else {
            return Promise.reject(exception);
        }
    }
}

module.exports = {
    lookupAddress
}