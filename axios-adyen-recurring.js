const axios = require('axios');

let hostURL = null;

if (process.env.NODE_ENV === "local" || process.env.NODE_ENV === "development") {
    hostURL = 'https://pal-test.adyen.com/pal/servlet/Recurring/V16';
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
        'Access-Control-Allow-Origin': '*'
    },
    auth: {
        username: 'ws@Company.ChokChok',
        password: '7kI>jt&t1>%(^@41J~{qK*&V+'
    }
});

module.exports = instance;