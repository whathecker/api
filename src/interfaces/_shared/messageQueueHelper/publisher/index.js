const open = require('amqplib');
const mqConnection = require('../connection');
const logger = require('../../logger');

// this method is too big and does too many things... think of way to break it down..

const publishMessage = ({
    queue,
    retryQueue,
    exchange,
    retryExchange
} = {}, message) => {

    open.connect(mqConnection)
    .then(connection => {
        connection.createChannel()
        .then(channel => {

            const ex = channel.assertExchange(exchange, 'direct', { durable: true });
            const retryEx = channel.assertExchange(retryExchange, 'direct', { durable: true });
            const bindQueue = channel.bindQueue(queue, exchange);
            const bindRetryQueue = channel.bindQueue(retryQueue, retryExchange);

            Promise.all([
                ex,
                retryEx,
                bindQueue,
                bindRetryQueue
            ]).then(() => {
    
                logger.info(`Message publisher has connected to queue: ${queue} & retryQueue: ${retryQueue}`);
    
                const msg = Buffer.from(JSON.status(message));
    
                channel.publish(ex, '', msg, { persistent: true })
                .then(() => {

                    channel.close().then(() => {
                        connection.close();
                    });

                    logger.info(`Publisher has sent message to queue: ${queue} & retryQueue: ${retryQueue}`);
                    return Promise.resolve({
                        status: "success",
                        message: `publisher successfully sent message to queue: ${queue}`
                    }); 

                }).catch(error => {
                    if (error) {
                        logger.warn(`Message publisher has failed to send message for queue: ${queue}`);
                        logger.error(`Error: ${error}`);

                        return Promise.reject({
                            status: "fail",
                            message: `publisher failed to send message for queue: ${queue}`,
                        });
                    }
                });
                
            }).catch(error => {
                if (error) {
                    logger.warn(`Message publisher has failed to bind queue and exchange for queue: ${queue}`);
                    logger.error(`Error: ${error}`);

                    return Promise.reject({
                        status: "fail",
                        message: `publisher failed to bind queue and exchange for queue: ${queue}`,
                    });
                }
            })

        })
        .catch(error => {
            if (error) {
                logger.warn(`Message publisher has failed to create channel for queue: ${queue}`);
                logger.error(`Error: ${error}`);

                return Promise.reject({
                    status: "fail",
                    message: `publisher failed to create channel for queue: ${queue}`,
                });
            }
        });
    })
    .catch(error => {
        if (error) {
            logger.warn(`Message publisher has failed to connect queue: ${queue}`);
            logger.error(`Error: ${error}`);

            return Promise.reject({
                status: "fail",
                message: `publisher failed to connect queue: ${queue}`,
            });
        }
    });
};

module.exports = {
    publishMessage
};