const serviceChoice = require('./serviceSelector')();
let {
    createSession,
    getPaymentMethods
} =  require(`./${serviceChoice}`);

module.exports = {
    createSession,
    getPaymentMethods
};