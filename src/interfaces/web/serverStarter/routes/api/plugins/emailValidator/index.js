const emailValidatorService = require('./service');
const logger = require('../../../../../../_shared/logger');

let emailValidator = {};

emailValidator.validateEmail = async (req, res, next) => {
    const email = req.body.email;

    if (!email) {
        logger.warn(`validateEmail request has rejected - bad request`);
        return res.status(400).json({
            status: "fail",
            message: "bad request"
        });
    }

    //TODO: 
    //think if needed to call userDB to find if this email is used for different account already
    //or to force client to make getUserByEmail first and decide to make subsequenct call 

    try {
        const result = emailValidatorService.verifyEmailAddress(email);
        logger.info(`validateEmail request has processed - email: ${email} result: ${result.validation_result}`)
        return res.status(200).json(result);
    } catch (exception) {

        if (exception.status === "fail") {
            logger.info(`validateEmail endpoint failed: ${exception.reason}`);
            return res.status(422).json(exception);
        } else {
            next(exception);
        } 
    }
};

module.exports = emailValidator;