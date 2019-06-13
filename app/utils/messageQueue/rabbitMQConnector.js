
module.exports = function () {
    const envVar =  process.env.NODE_ENV;

    if (envVar === "local") {
        return 'amqp://guest:guest@localhost:5672/';
    } else {
        return 'amqp://rabbitmq:rabbitmq@rabbitmq:5672/';
    }

}