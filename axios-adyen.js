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

instance = axios.create({ baseURL: hostURL });

instance.defaults.headers.common['Content-Type'] = 'application/json';
instance.defaults.headers.common['X-API-Key'] = 'AQEjhmfuXNWTK0Qc+iSTmmszhOyUQxykUnrll3IX+Lj+mqAVq/4QwV1bDb7kfNy1WIxIIkxgBw==-9o8lkJ/+u6M4IbCEmKEZmrydrWBgdQ13qcYRZUk+qV0=-q6nr5cxPxg4FmQwj';
instance.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

module.exports = instance;