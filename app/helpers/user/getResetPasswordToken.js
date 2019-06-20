const User = require('../../models/User');
const logger = require('../../utils/logger');
const jwt = require('jsonwebtoken');

function getResetPasswordToken (req, res, next) {
    const token = req.params.token;

    if (!token) {
        logger.warn(`getResetPasswordToken request has failed | bad request | invalid parameter`);
        return res.status(400).json({
            status: res.status,
            message: "bad request"
        });
    }

    User.findOne({ pwdResetToken: token })
    .then((user) => {
        const tokenSecret = "5rYIkazQmdGwfDN1Y2BhAUZLgad25DUI";
     
        if (!user) {
            logger.info(`getResetPasswordToken request has processed, but failed to find matching token`);
            // return empty response body when no user is found
            return res.status(200).json({});
        }
        
        if (user) {
            jwt.verify(user.pwdResetToken, tokenSecret, (err, decoded) => {
                if (err) {
                    console.log(err);
                    // remove invalid or expired token
                    user.pwdResetToken = '';
                    user.markModified('pwdResetToken');
                    user.save();
                    logger.warn(`getResetPasswordToken request has processed, but token is expired. token has been removed from user data`);
                    return res.status(422).json({
                        message: 'token is invalid or expired'
                    });

                } else {
                    logger.info(`getResetPasswordToken request has processed and found matching token`);
                    return res.status(200).json({
                        token: user.pwdResetToken
                    });
                }

            });
        }
       
    }).catch(next);
}

module.exports = getResetPasswordToken;