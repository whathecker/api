const User = require('../../models/User');
const logger = require('../../utils/logger');
const jwt = require('jsonwebtoken');

function resetPassword (req, res, next) {
    const token = req.body.pwdResetToken;
    const password = req.body.password;
    

    if (!token || !password) {
        logger.warn(`resetPassword request has rejected | bad request`);
        return res.status(400).json({
            message: 'bad request | missing parameters'
        });
    }

    User.findOne({ pwdResetToken: token })
    .then((user) => {
        const tokenSecret = "5rYIkazQmdGwfDN1Y2BhAUZLgad25DUI";

        if (!user) {
            logger.warn(`resetPassword request has failed | no user was found`);
            return res.status(422).json({
                message: 'token is invalid or expired'
            });
        }

        if (user) {
            jwt.verify(user.pwdResetToken, tokenSecret, (err, decoded) => {
                if (err) {
                    console.log(err);
                    // remove invalid or expired token
                    user.pwdResetToken = '';
                    user.markModified('pwdResetToken');
                    user.save().then(() => {
                        logger.warn(`resetPassword request has failed | token is invalid or expired | ${user.email}`);
                        return res.status(422).json({
                            message: 'token is invalid or expired'
                        });
                    }).catch(next);  
                } else {

                    if (user._id.equals(decoded.user_id)) {
                        user.hash = user.setPassword(user, password);
                        user.markModified('hash');
                        user.pwdResetToken = '';
                        user.markModified('pwdResetToken');
                        user.lastModified = Date.now();
                        user.markModified('lastModified');
                        user.save().then((user) => {
                            if (user) {
                                return res.status(200).json({
                                    message: 'password has updated'
                                });
                            }
                        }).catch(next);
                    }
    
                    if (!user._id.equals(decoded.user_id)) {
                        user.pwdResetToken = '';
                        user.markModified('pwdResetToken');
                        user.save().then(() => {
                            return res.status(422).json({
                                message: 'token is invalid or expired'
                            });
                        }).catch(next);
                    } 

                }
                  
            });
        }

    }).catch(next);
}

module.exports = resetPassword;