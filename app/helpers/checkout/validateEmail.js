const User = require('../../models/User');
const logger = require('../../utils/logger');
const axiosTrueMail = require('../../../axios-truemail');
const errorDispatchers = require('../../utils/errorDispatchers/errorDispatchers');

function checkDuplicateEmail (req, res, next) {
    // find if account exist with email address
    const email = req.body.email;

    if (!email) {
        logger.warn(`validateEmail request has rejected | bad request`);
        return res.status(400).json({
            status: "failed",
            message: "bad request"
        });
    }
    
    if (email) {
        User.findOne({ email: email })
            .then((user) => {
                if (!user) {

                    axiosTrueMail.get(`/verify/single?access_token=${axiosTrueMail.apikey}&email=${email}`)
                    .then((response) => {
                        const result = response.data.result;
                        const status = response.data.status;
                        
                        // timeout request for edge case email addresses
                        // e.g. domain from naver.com..etc
                        res.setTimeout(50, () => {
                            logger.warn(`validateEmail request has processed but failed to get verification from TrueMail, check if ${email} is valid with user | take too long to get response from TrueMail`);
                            return res.status(200).json({
                                status: "success",
                                result: "no_result",
                                message: "email validation failed - timeout"
                            })
                        });

                        if (status === "throttle_triggered") {

                            logger.warn('truemail api rate exceeded');
                            errorDispatchers.dispatchTruemailRatelimitError(email);
                            logger.warn(`validateEmail request has processed but failed to get verification from TrueMail, check if ${email} is valid with user | check Truemail credit`);
                            return res.status(200).json({
                                status: "success",
                                result: "no_result",
                                message: "email validation failed - rate exceed"
                            });
                        }

                        if (status === "success" && result === "invalid") {
                            logger.info(`validateEmail request has processed | email address is invalid | ${email}`);
                            return res.status(200).json({
                                status: "success",
                                result: "invalid",
                                message: 'invalid email address'
                            });
                        }

                        if (status === "success" && result === "valid") {
                            logger.info(`validateEmail request has processed | email address is valid | ${email}`);
                            return res.status(200).json({
                                status: "success",
                                result: "valid",
                                message: "valid email address"
                            });
                        }

                        if (status === "general_failure" || status === "temp_unavail") {
                            logger.warn('truemail api return error: ' + status);
                            errorDispatchers.dispatchTruemailError(email);
                            logger.warn(`validateEmail request has processed but failed to get verification from TrueMail, check if ${email} is valid with user | check Truemail API Error`);
                            return res.status(200).json({
                                status: "success",
                                result: "no_result",
                                message: "email validation failed - error"
                            });
                            
                        }

                    }).catch(next); 

                }

                if (user) {
                    logger.info(`validateEmail request has processed | email address is duplicated | ${email}`);
                    return res.status(200).json({
                        status: "success",
                        result: "duplicated",
                        message: "duplicated email address"
                    });
                }
                
            }).catch(next);
    } 
}

module.exports = checkDuplicateEmail;
