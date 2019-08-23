const logger = require('../../utils/logger');
const User = require('../../models/User');
const axiosSendGrid = require('../../../axios-sendgrid');
const axiosTruemail = require('../../../axios-truemail');
const errorDispatchers = require('../../utils/errorDispatchers/errorDispatchers');

function optinToNewsletter (req, res, next) {
    const email = req.body.email;

    if (!email) {
        logger.warn(`optinToNewsletter request has rejected | bad request |`);
        return res.status(400).json({
            status: "failed",
            message: 'bad request'
        });
    }

    if (email) {

        const sendGridpayload = { contacts: [{ email: email }] };

        User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                
                axiosTruemail.get(`/verify/single?access_token=${axiosTruemail.apikey}&email=${email}`)
                .then((response) => {
                    //console.log(response);

                    const result = response.data.result;
                    const status = response.data.status;


                    if (status === "success" && result === "invalid") {
                        logger.info(`optinToNewsletter request has rejected | email address invalid | ${email}`);
                        return res.status(422).json({
                            result: 'failed',
                            message: 'invalid email address'
                        });
                    }

                    // optin user when email is valid 
                    // or when truemail api exceed rate limit

                    if (status === "throttle_triggered" ||
                        (status === "success" && result === "valid")) {
                        
                        status === "throttle_triggered"? 
                            errorDispatchers.dispatchTruemailRatelimitError() : null;
    
                        
                        axiosSendGrid.put('/marketing/contacts', sendGridpayload)
                        .then((response) => {

                            if (response.status === 202) {
                                logger.info(`optinToNewsletter request has processed | ${email}`);
                                return res.status(201).json({
                                    result: 'success',
                                    message: 'user subscribed to newsletter'
                                });
                            }
                            
                        }).catch(error => {
                            errorDispatchers.dispatchSendGridOptinError(error);
                            next(error);
                        });
                        
                    }
                }).catch(next);

            }

            if (user && user.newsletterOptin === true) {
                logger.info(`optinToNewsletter request has not processed (user) | user already optted-in | ${email}`);
                return res.status(200).json({
                    result: 'failed',
                    message: 'user has already optin'
                });
            }

            if (user && user.newsletterOptin === false) {
                //console.log(user);

                axiosSendGrid.put('/marketing/contacts', sendGridpayload)
                .then((response) => {
                    //console.log(response);
                    if (response.status === 202) {
                        user.newsletterOptin = true;
                        user.lastModified = Date.now();
                        user.markModified('newsletterOptin');
                        user.markModified('lastModified');
                        user.save().then(()=> {
                            logger.info(`optinToNewsletter request has processed (user) | ${email}`);
                            return res.status(201).json({
                                result: 'success',
                                message: 'user subscribed to newsletter'
                            });
                        }).catch(next);
                    } 
                
                }).catch(error => {
                    errorDispatchers.dispatchSendGridOptinError(error);
                    next(error);
                });
            }

        }).catch(next);
    }

}

module.exports = optinToNewsletter;