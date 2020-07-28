const mqHelper = require('../_shared/messageQueueHelper');
const consumers = require('./consumers');
const logger = require('../_shared/logger');

function startConsumers () {
    mqHelper.receiver.createReceiverConnection()
    .then(connection => {
        logger.info('Connection for MQ receivers has been established');

        for (let prop of Object.keys(mqHelper.queues)) {
            const consumerName = mqHelper.queues[prop].queue;

            if (!consumers[consumerName]) {
                connection.close();
                throw new Error(`Failed to enable consumer ${consumerName}: no matching callback has found in consumers module`);
            }

            const callback = consumers[consumerName].consumeQueue;

            _enableConsumer(connection, {
                queue: mqHelper.queues[prop].queue,
                retryQueue: mqHelper.queues[prop].retryQueue
            }, callback);
        }

    })
    .catch(err => {
        console.log(err);
        logger.error('Failed to establish connection to MQ receivers: retry in 10s');
        return setTimeout(startConsumers, 10000);
    });
}

function _enableConsumer (connection, {
    queue,
    retryQueue
} = {}, callback) {
    return connection.createChannel()
    .then(channel => {

        logger.info(`Message receiver has created channel for queue: ${queue}`);

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
            return channel.consume(queue, callback);
            
        }).catch (error => {
            if (error) {
                console.log(error);
                channel.close().then(connection.close());
                logger.error(`Message receiver has failed to connect queue: ${queue}`);
            }
        }); 
    });
}

startConsumers();