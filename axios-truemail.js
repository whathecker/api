const axios = require('axios');

const hostURL = 'https://truemail.io/api/v1';

const apikey = process.env.TRUEMAIL_APIKEY;

let instance = axios.create({
    baseURL: hostURL,
});

module.exports = instance;
module.exports.apikey = apikey;