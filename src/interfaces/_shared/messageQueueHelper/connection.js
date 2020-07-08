const config = require('../../../configuration');

const env = config.NODE_ENV;

const _getMqConnectionString = (env) => {
    if (env === "local" || env === "test") {
        return 'amqp://guest:guest@localhost:5672/';
    } else {
        return `amqp://${config.rabbitMQ.username}:${config.rabbitMQ.password}@rabbitmq:5672/`;
    }
}

module.exports = _getMqConnectionString(env);