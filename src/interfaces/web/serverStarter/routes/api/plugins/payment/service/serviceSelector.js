const config = require('../../../../../../../../configuration');

module.exports = () => {
    if (config.PAYMENT_PROCESSOR === "stripe") {
        return "stripe";
    }

    throw new Error("Unknonw config option at PAYMENT_PROCESSOR: use supported payment service");
}