const axios = require('axios');

const hostURL = 'https://hooks.slack.com/services/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';

module.exports = axios.create({
    baseURL: hostURL
});