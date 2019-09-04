/*
const axios = require('axios');

let hostURL = null;

let basicAuthUsername;
let basicAuthPassword;
const env = process.env.NODE_ENV;
if (env === "local" || env === "development" || env === "test") {
    hostURL = 'https://pal-test.adyen.com/pal/servlet/Recurring/V16';
    basicAuthUsername = process.env.ADYEN_BASIC_AUTH_USERNAME_TEST;
    basicAuthPassword = process.env.ADYEN_BASIC_AUTH_PASSWORD_TEST;
}

if (env === "production") {
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
        'Access-Control-Allow-Origin': '*'
    },
    auth: {
        username: basicAuthUsername,
        password: basicAuthPassword
    }
}); */

module.exports = {};