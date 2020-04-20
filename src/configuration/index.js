require('dotenv').config();

module.exports = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    mongo: {
        test: {
            USER: process.env.MONGO_USER_TEST,
            PWD: process.env.MONGO_PWD_TEST
        },
        dev: {
            USER: process.env.MONGO_USER_DEV,
            PWD: process.env.MONGO_PWD_DEV
        },
        prod: {
            USER: process.env.MONGO_USER_PROD,
            PWD: process.env.MONGO_PWD_PROD
        }
    }
};