const axios = require('./axios');

const getAddressDetail = async (payload = {}) => {

    const postalCode = payload.postalCode;
    const houseNumber = payload.houseNumber;

    if (!houseNumber || !postalCode) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            message: "invalid payload for lookup",
        });
    }

    try {
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

