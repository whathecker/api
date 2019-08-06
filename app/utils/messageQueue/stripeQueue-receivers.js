const queue = 'stripe';
const retryQueue = 'stripe-retry';
const open = require('amqplib');
const rabbitMQConnection = require('./rabbitMQConnector');
const logger = require('../logger');


function startMQConnection () {
    open.connect(rabbitMQConnection())
    .then(connection => {
        return connection.createChannel()
    })
    .then(ch => {
        const workQueue = ch.assertQueue(queue, {
            deadLetterExchange: retryQueue
        });
        const retryWorkQueue = ch.assertQueue(retryQueue, {
            deadLetterExchange: queue,
            messageTtl : 300000
        });

        Promise.all([
            workQueue,
            retryWorkQueue
        ])
        .then(ok => {
            return ch.consume(queue, (msg) => {
                if (msg !== null) {
                    const message = JSON.parse(msg.content);
                    console.log(message);
                }
            })
        }).catch(console.warn);

    }).catch(error => {
        console.log('retry to connect rabbitmq because rabbitmq might not started yet' + 'stripeQueue');
        if (error) {
            return setTimeout(startMQConnection, 15000);
        }
    });
}

startMQConnection();