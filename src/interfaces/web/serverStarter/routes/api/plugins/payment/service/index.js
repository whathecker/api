const serviceChoice = require('./serviceSelector')();
let {
    createSession,
    getPaymentMethods,
    processWebhook
} =  require(`./${serviceChoice}`);

module.exports = {
    createSession,
    getPaymentMethods,
    processWebhook
};