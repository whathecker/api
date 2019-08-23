const logger = require('../../utils/logger');
const auth = require('basic-auth');
//const Order = require('../../models/Order');
const open = require('amqplib');
const rabbitMQConnection = require('../../utils//messageQueue/rabbitMQConnector');
const queue = 'notification';
const retryQueue = 'notification-retry';
const ex = 'notification';
const retryEx = 'notification-retry';

function checkAdyenBasicAuth(credentials) {
    let isAuth = false;
    let username;
    let password;
    if (process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'development'){
        username = process.env.ADYEN_NOTIFICATION_AUTH_USERNAME_TEST;
        password = process.env.ADYEN_NOTIFICATION_AUTH_PASSWORD_TEST;
    }
    
    if (credentials.name === username && credentials.pass === password) {
        isAuth = true;
    }
    return isAuth;
}

function startMQConnection () {
    return open.connect(rabbitMQConnection());
}

function handleNotification (req, res, next) {
    const credentials =  auth(req);
    //console.log(credentials);
    //console.log(open);

    if (!credentials || !checkAdyenBasicAuth(credentials)) {
        logger.warn('payment notification is requested with invalid basic auth header');
        res.set({ 'WWW-Authenticate': 'Basic realm="notification"' });
        return res.status(401).json({ message: 'unauthorized request' });
    } else {
        const notification = req.body;
        //console.log(notification);

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
                    ch.publish(ex, '', Buffer.from(JSON.stringify(req.body), { persistent: true }));
                    ch.close().then(() => {
                        connection.close();
                    });
                    return res.status(200).end("[accepted]");
                }).catch(next);

            }).catch(next);

        }).catch(next);
        
        // save notification in db
    }
}

module.exports = handleNotification;

