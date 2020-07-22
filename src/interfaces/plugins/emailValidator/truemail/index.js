const axios = require('./axios-truemail');

const verifyEmailAddress = async (email) => {
    try {
        const res = await axios.get(`/verify/single?access_token${axios.apikey}&email=${email}`);

        const result = res.data.result;
        const status = res.data.status;

        if (status === "success" && result === "valid") {
            return Promise.resolve({
                status: "success",
                result: "valid",
                message: "valid email address"
            });
        }

        if (status === "success" && result === "invalid") {
            return Promise.resolve({
                status: "success",
                result: "invalid",
                message: "invalid email address"
            });
        }

        if (status === "general_failure" || status === "temp_unavail") {
            return Promise.reject({
                status: "fail",
                result: "no_result",
                reason: "service temp unavailable",
                message: "email validation failed - service is unavailable"
            });
        }

        if (status === "throttle_triggered") {
            return Promise.reject({
                status: "fail",
                result: "no_result",
                reason: "rate_exceed",
                message: "email validation failed - rate exceed"
            });
        }

    } catch (err) {
        if (err) {
            return Promise.reject({
                status: "fail",
                result: "no_result",
                reason: "error",
                message: err.message
            });
        }
    }
};

module.exports = {
    verifyEmailAddress
};