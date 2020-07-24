const axios = require('axios');

const hostURL = 'https://api.postcodeapi.nu/v2';

let instance = axios.create({ 
    baseURL: hostURL,
    headers: {
        'X-API-Key': process.env.POSTALCODE_APIKEY
    }
});


module.exports = instance;