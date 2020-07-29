const config = require('../../../../../../../../configuration');

module.exports = () => {
    if (config.EMAIL_VALIDATOR === "truemail") {
        return "truemail";
    }

    throw new Error('Unknown config option at EMAIL_VALIDATOR: use supported email validator service');
}