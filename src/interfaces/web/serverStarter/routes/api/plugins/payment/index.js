const paymentService = require('./service');
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

module.exports = payment;