const serviceChoice = require('./serviceSelector')();
let {
    createSession
} =  require(`./${serviceChoice}`);

module.exports = {
    createSession
};