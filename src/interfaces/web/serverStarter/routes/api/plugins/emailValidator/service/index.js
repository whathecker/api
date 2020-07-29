const serviceChoice = require('./serviceSelector')();
let {
    verifyEmailAddress
} = require(`./${serviceChoice}`);

module.exports = {
    verifyEmailAddress
};