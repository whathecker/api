const User = require('../../models/User');
const logger = require('../../utils/logger');
const axiosTrueMail = require('../../../axios-truemail');
const axiosSlackTrueMail = require('../../../axios-slack-truemail');

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

                            const payload = {
                                text: `Truemail API credit limit is reached! (checkout)`,
                                attachments: [
                                    {
                                        fallback: "Charge your Truemail API credit",
                                        author_name: "Chokchok",
                                        title: `Please charge more TrueMail API credit | and check this email ${email}`,
                                        text: "visit https://truemail.io/ and sign-in to admin account, buy more credit"
                                    }
                                ]
                            }
                            axiosSlackTrueMail.post('', payload)
                            .then((response) => {
                                if (response) {
                                    logger.warn(`validateEmail request has processed but failed to get verification from TrueMail, check if ${email} is valid with user | check Truemail credit`);
                                    return res.status(200).json({
                                        status: "success",
                                        result: "no_result",
                                        message: "email validation failed - rate exceed"
                                    });
                                }
                            }).catch(next);
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

                            const payload = {
                                text: `Truemail API returned error (checkout)`,
                                attachments: [
                                    {
                                        fallback: "Check with Truemail Support",
                                        author_name: "Chokchok",
                                        title: `Following email: ${email}, is unverified due to TrueMail API error`,
                                        text: "Double check if email address is legit, contact TrueMail support for error in API"
                                    }
                                ]
                            }

                            axiosSlackTrueMail.post('', payload)
                            .then((response) => {
                                if (response) {
                                    logger.warn(`validateEmail request has processed but failed to get verification from TrueMail, check if ${email} is valid with user | check Truemail API Error`);
                                    return res.status(200).json({
                                        status: "success",
                                        result: "no_result",
                                        message: "email validation failed - error"
                                    });
                                }
                            }).catch(next);
                            
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
