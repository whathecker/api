const axios = require('axios');

let hostURL = null;

if (process.env.NODE_ENV === "local" || process.env.NODE_ENV === "development") {
    hostURL = 'https://checkout-test.adyen.com/checkout/v40';
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
        'X-API-key': 'AQEjhmfuXNWTK0Qc+iSTmmszhOyUQxykUnrll3IX+Lj+mqAVq/4QwV1bDb7kfNy1WIxIIkxgBw==-Ff5ZXyIPtq03CJYXGhAvNZAHFihCNFHxVHdnH8hxlNQ=-vz6MLItG3TDKs92z',
        'Access-Control-Allow-Origin': '*'
    }
});

module.exports = instance;