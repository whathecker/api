const axios = require('axios');

const hostURL = 'https://api.sendgrid.com/v3/';

let instance = axios.create({
    baseURL: hostURL,
    headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
    }
});

module.exports = instance;