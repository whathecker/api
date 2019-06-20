const open = require('amqplib');
const rabbitMQConnection = require('../../utils/messageQueue/rabbitMQConnector');
const queue = 'mail';
const retryQueue = 'mail-retry';
const ex = 'mail';
const retryEx = 'mail-retry';
const logger = require('../../utils/logger');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');


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

    User.findOne({ email: req.body.email }).then((user) => {
        
        if (!user) {
            req.body.emailType = 'forgotpwdnouser';
        } 

        if (user) {
            req.body.firstName = user.firstName;
            req.body.emailType = 'forgotpwd';  
            const tokenSecret = "5rYIkazQmdGwfDN1Y2BhAUZLgad25DUI";
            // jwt expired in 6 hours
            const pwdResetToken = jwt.sign({
                user_id: user._id
            }, tokenSecret, { expiresIn: '6h' });
            
            req.body.pwdResetToken = pwdResetToken;
            user.pwdResetToken = pwdResetToken;
            user.markModified('pwdResetToken');
            user.save();
        }

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
                    logger.info(`forgotPasswordEmail request has published email to MQ | ${req.body.email} | ${req.body.emailType}`);
                    return res.status(200).end();

                }).catch(next);

            }).catch(next);

        }).catch(next);  

    }).catch(next);

}

module.exports = sendForgotPasswordEmail;