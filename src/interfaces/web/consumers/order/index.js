const mqHelper = require('../../../_shared/messageQueueHelper');
const logger = require('../../../_shared/logger');
const orderQueue = 'order';
const orderRetryQueue = 'order-retry';

const enableConsumer = async () => {
    try {
        const result = await mqHelper.receiver.connectReceiver({
            queue: orderQueue,
            retryQueue: orderRetryQueue
        });

        if (result) {
            const channel = result.channel;
            return channel.consume(orderQueue, (msg) => {
                logger.info(`Message consumer has enabled: start to subscribe for message in queue: ${orderQueue}`);
                // handling business logics to be implemented here
            });
        }

    } catch (err) {
        logger.error(`Connection to queue ${orderQueue} failed: ${err}`);
        logger.warn(`${orderQueue} consumer will try re-establish connection in 15s`);
        return setTimeout(enableConsumer, 15000);
    };
}

module.exports = {
    enableConsumer
}