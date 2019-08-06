const axios = require('axios');

let hostURL = null;
let apikey;
if (process.env.NODE_ENV === "local" || process.env.NODE_ENV === "development") {
    hostURL = 'https://checkout-test.adyen.com/checkout/v40';
    apikey = process.env.ADYEN_APIKEY_TEST;
}

if (process.env.NODE_ENV === "production") {
    // add production hostURL of Adyen here
}

let instance;

if (!hostURL) {
    throw new Error('cannot initialize axios instance, enviorment variable is missing'); 
}

instance = axios.create({ 
    baseURL: hostURL,
    headers: {
        'Content-Type': 'application/json',
        'X-API-key': apikey,
        'Access-Control-Allow-Origin': '*'
    }
});

module.exports = instance;