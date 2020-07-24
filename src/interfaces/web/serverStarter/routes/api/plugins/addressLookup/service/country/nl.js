const axios = require('./axios');

const _validatePayload = (payload) => {
    if (!payload.postalCode || !payload.houseNumber) {
        throw new Error("address lookup request failed: country - NL, invalid payload");
    }
}

const getAddressDetail = async (payload = {}) => {

    try {
        _validatePayload(payload);
        
        const postalCode = payload.postalCode;
        const houseNumber = payload.houseNumber;
        const res = await axios.get(`/addresses/?postcode=${postalCode}&number=${houseNumber}`);

        const status = res.status;
        const addressData = res.data._embedded['addresses'];

        if (status === 200 && addressData.length === 0) {
            return Promise.resolve({
                status: "success",
                result: "address not found",
                address: null
            });
        }

        if (status === 200 & addressData.length !== 0) {
            return Promise.resolve({
                status: "success",
                result: "address found",
                address: addressData
            });
        }
    } catch (err) {
        return Promise.reject({
            status: "fail",
            result: "error",
            error: err.message
        });
    }

};

module.exports = {
    getAddressDetail
};

