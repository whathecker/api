const rabbitMQConnection = require('../connection');

const connectPublisher = ({
    queue,
    retryQueue,
    exchange,
    retryExchange
} = {}) => {
    // return Promise with channel object
};

const publishMessageToQueue = (channelObj, messageObj) => {
    // return Promise withs status indicating if message was published
};

module.exports = {
    connectPublisher,
    publishMessageToQueue
};