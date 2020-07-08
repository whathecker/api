require('dotenv').config();

module.exports = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DB_SELECTION: process.env.DB_SELECTION,
    mongo: {
        test: {
            MONGO_USER: process.env.MONGO_USER_TEST,
            MONGO_PWD: process.env.MONGO_PWD_TEST
        },
        dev: {
            MONGO_USER: process.env.MONGO_USER_DEV,
            MONGO_PWD: process.env.MONGO_PWD_DEV
        },
        prod: {
            MONGO_USER: process.env.MONGO_USER_PROD,
            MONGO_PWD: process.env.MONGO_PWD_PROD
        }
    },
    rabbitMQ: {
        username: process.env.RABBITMQ_USERNAME,
        password: process.env.RABBITMQ_PASSWORD
    }
};