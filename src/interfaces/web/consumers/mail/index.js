const mqHelper = require('../../../_shared/messageQueueHelper');
const logger = require('../../../_shared/logger');
const mailQueue = 'mail';
const mailRetryQueue = 'mail-retry';

const enableConsumer = async () => {
    try {
        const result = await mqHelper.receiver.connectReceiver({
            queue: mailQueue,
            retryQueue: mailRetryQueue
        });

        if (result) {
            const channel = result.channel;
            return channel.consume(mailQueue, (msg) => {
                logger.info(`Message consumer has enabled: start to subscribe for message in queue: ${mailQueue}`);
                // handling business logics to be implemented here
            });
        }
        
    } catch (err) {
        logger.error(`Connection to queue ${mailQueue} failed: ${err}`);
        logger.warn(`${mailQueue} consumer will try re-establish connection in 15s`);
        return setTimeout(enableConsumer, 15000);
    };
}

module.exports = {
    enableConsumer
}