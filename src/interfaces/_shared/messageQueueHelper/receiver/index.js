const open = require('amqplib');
const mqConnection = require('../connection');
const logger = require('../../logger');

const connectReceiver = ({
    queue,
    retryQueue
} = {}) => {
    
    open.connect(mqConnection)
    .then(connection => {
        connection.createChannel()
        .then(channel => {

            const workQueue = channel.assertQueue(queue, {
                deadLetterExchange: retryQueue
            });
    
            const retryWorkQueue = channel.assertQueue(retryQueue, {
                deadLetterExchange: queue,
                messageTtl: 300000
            });
    
            Promise.all([
                workQueue,
                retryWorkQueue
            ]).then(() => {
                logger.info(`Message receiver has connected to queue: ${queue}`);

                return Promise.resolve({
                    status: "success",
                    message: `consumer successully connected to queue: ${queue}`,
                    channel: channel
                });
            });
    
        }).catch(error => {
            if (error) {
                logger.error(`Message receiver has failed to connect queue: ${queue}`);
    
                return Promise.reject({
                    status: "fail",
                    message: `consumer failed to connect queue: ${queue}`
                });
            }
        });
    });
};

module.exports = {
    connectReceiver
};