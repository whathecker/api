const axios = require('axios');

const hostURL = 'https://api.sendgrid.com/v3/';

let instance = axios.create({
    baseURL: hostURL,
    headers: {
        "Authorization": `Bearer ${process.env.SENDGIRD_APIKEY}`,
        "Content-Type": "application/json"
    }
});

module.exports = instance;