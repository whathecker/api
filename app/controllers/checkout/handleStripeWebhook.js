const stripeHelpers = require('../../utils/stripe/stripeHelpers');
const stripe =  require('stripe')(stripeHelpers.retrieveApikey());
const logger = require('../../utils/logger');
const open = require('amqplib');
const rabbitMQConnection = require('../../utils/messageQueue/rabbitMQConnector');
const queue = 'stripe';
const retryQueue = 'stripe-retry';
const ex = 'stripe';
const retryEx = 'stripe-retry';

function startMQConnection () {
    return open.connect(rabbitMQConnection());
}

function handleStripeWebhook (req, res, next) {

    const endpointSecret = stripeHelpers.getEndpointSecret(process.env.NODE_ENV);
    const signature = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.rawBody, signature, endpointSecret);
    }
    catch (error) {
        return res.status(400).send(`Webhook error ${error.message}`);
    }

    console.log(event);

    startMQConnection().then(connection => {
        connection.createChannel()
        .then(ch => {
            const exchange = ch.assertExchange(ex, 'direct', { durable: true });
            const retryExchange = ch.assertExchange(retryEx, 'direct', { durable: true });
            const bindQueue = ch.bindQueue(queue, ex);
            const bindRetryQueue = ch.bindQueue(retryQueue, retryEx);

            Promise.all([
                exchange,
                retryExchange,
                bindQueue,
                bindRetryQueue
            ]).then(ok => {
                ch.publish(ex, '', Buffer.from(JSON.stringify(event), { persistent: true }));
                ch.close().then(() => {
                    connection.close();
                });
                logger.info(`stripe webhook has passed to MQ`);
                return res.status(200).end();
            }).catch(next);
        }).catch(next);
    }).catch(next);
   
}

module.exports = handleStripeWebhook;