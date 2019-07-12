const axios = require('axios');

let hostURL = 'https://hooks.slack.com/services/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';

module.exports = axios.create({
    baseURL: hostURL
});