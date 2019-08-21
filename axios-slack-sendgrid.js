const axios = require('axios');

let hostURL = null;
const currentEnv = process.env.NODE_ENV;

if (currentEnv === 'test' ||currentEnv === "local" || currentEnv === "development") {
    hostURL ='https://hooks.slack.com/services/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';
}

if (currentEnv === "production") {
    hostURL = 'https://hooks.slack.com/services/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';
}

let instance;

if (!hostURL) {
    throw new Error('cannot initialize axios instance, enviorment variable is missing'); 
}

instance = axios.create({
    baseURL: hostURL
});

module.exports = instance;