const paymentService = require('./service');
const mqHelper = require('../../../../../../_shared/messageQueueHelper');
const queues = mqHelper.queues;
const logger = require('../../../../../../_shared/logger');

let payment = {};

payment.createPaymentSession = async (req, res, next) => {
    try {
        const payload = req.body;
        
        const result = await paymentService.createSession(payload);
        
        if (result.status === "success") {
            logger.info(`payment session has created - session: ${result.session}`);
            return res.status(200).json({
                status: 'success',
                message: 'payment session has created',
                session: result.session
            });
        }
        
    } catch (exception) {
        if (exception.status === "fail") {
            
            if (exception.message === "bad request") {
                logger.error(`createPaymentSesison request has failed - reason: ${exception.message}`);
                return res.status(400).json(exception);
            }

            if (exception.message === "error") {
                logger.error(`createPaymentSesison request has failed - reason: ${exception.error.message}`);
                return res.status(422).json(exception);
            }
            
        } else {
            next(exception);
        }
    }
};

payment.getPaymentMethods = async (req, res, next) => {
    try {
        const result = await paymentService.getPaymentMethods();

        logger.info(`getPaymentMethods request has returned available paymentMethods`);
        return res.status(200).json({
            status: result.status,
            message: result.message,
            paymentMethods: result.paymentMethods
        });
    } catch (exception) {
        next(exception);
    }
};

payment.processWebhook = async (req, res, next) => {
    try {
        const signature = req.headers['stripe-signature'];
        const rawBody = req.rawBody;

        const result = await paymentService.processWebhook(rawBody, signature);

        const msg = result.event;
        await mqHelper.publisher.publishMessage(queues.stripe, msg);
        
        logger.info(`processWebhook request has processed and dispatched message to queue -  event: ${result.event.type}`);
        return res.status(200).end();
    } catch (exception) {
        if (exception.status === "fail") {
            logger.error(`processWebhook request has failed to process message - error : ${exception.message}`);
            return res.status(400).json(exception);
        } else {
            next(exception);
        }
    }
};

module.exports = payment;