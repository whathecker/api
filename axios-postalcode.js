const axios = require('axios');

const hostURL = 'https://api.postcodeapi.nu/v2';

let instance = axios.create({ 
    baseURL: hostURL,
    headers: {
        'X-API-Key': 's1rWbKAu8h9ptsB4gitaR4gTqtc4UjCM9f8cYlxf'
    }
});


module.exports = instance;