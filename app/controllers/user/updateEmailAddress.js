const User = require('../../models/User');
const logger = require('../../utils/logger');

function updateEmailAddress (req, res, next) {

    const originalEmail = req.body.email;
    const password = req.body.password;
    const newEmail = req.body.newEmail;

    if (req.user) {
        User.findById(req.user._id)
        .then((user) => {

            if (user) {
                const origianlUser = user;
                const passwordValidity = user.validatePassword(user, password);

                if (!passwordValidity) {
                    logger.warn(`email address update request has rejected as password is invalid ${originalEmail}`)
                    return res.status(403).json({
                        status: res.status,
                        message: 'invalid password'
                    });
                }

                if (passwordValidity) {
                    User.findOne({ email: newEmail })
                    .then((user) => {
                        if (!user) {
                            // process email update
                            origianlUser.email = newEmail;
                            origianlUser.lastModified = Date.now();
                            origianlUser.markModified('email');
                            origianlUser.markModified('lastModified');
                            origianlUser.save()
                            .then((user) => {
                                if (user) {
                                    console.log(user);
                                    logger.info(`email address update request has processed | old email: ${originalEmail} new email: ${user.email}`)
                                    return res.status(200).json({
                                        status: res.status,
                                        message: 'email has updated',
                                        newEmail: user.email
                                    });
                                }
                            })
                            .catch(next);

                        } else {
                            logger.warn(`email address update request has rejected as new email aqddress alreadty exist  new email: ${newEmail}`)
                            return res.status(422).json({
                                status: res.status,
                                message: 'duplicated email'
                            });
                        }
                    }).catch(next);
                } 

            }
        }).catch(next);

    }
    
}

module.exports = updateEmailAddress;