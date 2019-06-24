const logger = require('../../utils/logger');
const User = require('../../models/User');
const axiosSendGrid = require('../../../axios-sendgrid');
const axiosTruemail = require('../../../axios-truemail');

function optinToNewsletter (req, res, next) {
    const email = req.body.email;

    if (!email) {
        logger.warn(`optinToNewsletter request has rejected | bad request |`);
        return res.status(400).json({
            message: 'bad request'
        });
    }

    if (email) {
        User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                
                axiosTruemail.get(`/verify/single?access_token=${axiosTruemail.apikey}&email=${email}`)
                .then((response) => {
                    //console.log(response);

                    const result = response.data.result;


                    if (response.status === 200 && result === "invalid") {
                        logger.info(`optinToNewsletter request has rejected | email address invalid | ${email}`);
                        return res.status(422).json({
                            result: 'failed',
                            message: 'invalid email address'
                        });

                    }

                    // optin user when email is valid 
                    // or when truemail api exceed rate limit

                    if (response.data.status === "throttle_triggered" ||
                        (response.status === 200 && result === "valid")) {
                        
                        const payload = [{ email: email }];

                        (response.data.status === "throttle_triggered")?
                        logger.warn('truemail api rate exceeded') : null;

                        axiosSendGrid.post('/contactdb/recipients', payload)
                        .then((response) => {
                            //console.log(response);

                            const newCount = response.data.new_count;

                            if (response.status === 201 && newCount === 0) {
                                logger.info(`optinToNewsletter request has not processed | user already optted-in| ${email}`);
                                return res.status(200).json({
                                    result: 'failed',
                                    message: 'user has already optin'
                                });
                            }

                            if (response.status === 201 && newCount === 1) {
                                logger.info(`optinToNewsletter request has processed | ${email}`);
                                return res.status(201).json({
                                    result: 'success',
                                    message: 'user subscribed to newsletter'
                                });
                            }

                        }).catch(next);
                        
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
                const payload = [{ email: email }];

                axiosSendGrid.post('/contactdb/recipients', payload)
                .then((response) => {
                    //console.log(response);
                    
                    if (response.status === 201) {

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

                }).catch(next);
            }

        }).catch(next);
    }

}

module.exports = optinToNewsletter;