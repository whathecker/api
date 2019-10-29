const axios = require('axios');

const hostURL = 'https://hooks.slack.com/services/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';

module.exports = axios.create({
    baseURL: hostURL
});