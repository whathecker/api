const open = require('amqplib');
const rabbitMQConnection = require('../../utils/messageQueue/rabbitMQConnector');
const queue = 'mail';
const retryQueue = 'mail-retry';
const ex = 'mail';
const retryEx = 'mail-retry';
const logger = require('../../utils/logger');

function startMQConnection () {
    return open.connect(rabbitMQConnection());
}

function sendTransactionalEmail (req, res, next) {
   
    console.log(req.body);

    startMQConnection().then((connection) => {
        connection.createChannel()
        .then((ch) => {
            const exchange = ch.assertExchange(ex, 'direct', { durable: true });
            const retryExchange = ch.assertExchange(retryEx, 'direct', { durable: true });
            const bindQueue = ch.bindQueue(queue, ex);
            const bindRetryQueue = ch.bindQueue(retryQueue, retryEx);

            Promise.all([
                exchange,
                retryExchange,
                bindQueue,
                bindRetryQueue
            ]).then((ok) => {
                ch.publish(ex, '', Buffer.from(JSON.stringify(req.body)), { persistent: true });
                ch.close().then(()=> {
                    connection.close();
                });
                logger.info(`sendTransactionalEmail request has published email to MQ | ${req.body.emailType} ${req.body.email}`);
                return res.status(200).end();
            }).catch(next);

        }).catch(next);

    });

}

module.exports = sendTransactionalEmail;