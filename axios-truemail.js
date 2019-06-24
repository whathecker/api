const axios = require('axios');

const hostURL = 'https://truemail.io/api/v1';

const apikey = '7YGXf4WotUMzyy1TsgPUKXiwgvHl0re3dyUkcASsaSTT3i4DS2xQeu42fWph3EVb';

let instance = axios.create({
    baseURL: hostURL,
});

module.exports = instance;
module.exports.apikey = apikey;