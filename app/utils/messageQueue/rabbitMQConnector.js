
module.exports = function () {
    const envVar =  process.env.NODE_ENV;

    if (envVar === "local" || envVar === "test") {
        return 'amqp://guest:guest@localhost:5672/';
    } else {
        return `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@rabbitmq:5672/`;
    }

}