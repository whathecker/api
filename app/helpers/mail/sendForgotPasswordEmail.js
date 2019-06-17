const open = require('amqplib');
const rabbitMQConnection = require('../../utils/messageQueue/rabbitMQConnector');
const queue = 'mail';
const retryQueue = 'mail-retry';
const ex = 'mail';
const retryEx = 'mail-retry';
const logger = require('../../utils/logger');
const User = require('../../models/User');


function startMQConnection () {
    return open.connect(rabbitMQConnection());
}

function sendForgotPasswordEmail (req, res, next) {

    if (!req.body.email) {
        logger.warn(`sendForgotPasswordEmail request has rejected | bad request | ${req.body.email}`);
        return res.status(400).json({
            status: res.status,
            message: 'bad request'
        });
    }

    if (req.body.emailType !== 'forgotpassword') {
        logger.warn(`sendForgotPasswordEmail request has rejected | invalid emailType param | ${req.body.email}`);
        return res.status(422).json({
            status: res.status,
            message: 'bad request: invalid emailType'
        });
    }

    User.findOne({ email: req.body.email }).then((user) => {
        
        if (!user) {
            logger.info(`sendForgotPasswordEmail request has not found associated acount with given email | ${req.body.email}`);
            return res.status(204).json({
                status: res.status,
                message: 'no user found with the email'
            });
        } 

        if (user) {
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
                        logger.info(`forgotPasswordEmail request has published email to MQ | ${req.body.email}`);
                        return res.status(200).end();

                    }).catch(next);

                }).catch(next);

            }).catch(next);    
        }
    }).catch(next);

}

module.exports = sendForgotPasswordEmail;