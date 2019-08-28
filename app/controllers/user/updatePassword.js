const User = require('../../models/User');
const logger = require('../../utils/logger');

function updatePassword (req, res, next) {
    console.log(req.body);

    const password = req.body.password;
    const newPassword = req.body.newPassword;
    if (!password || !newPassword) {
        logger.warn(`updatePassword request has failed - bad request`);
        return res.status(400).json({
            status: 'failed',
            message: 'bad request'
        });
    }

    if (req.user) {
        
        User.findById(req.user._id)
        .then((user) => {
            if (user) {
                const passwordValidity = user.validatePassword(user, password);

                if (!passwordValidity) {
                    logger.warn(`password update request has rejected as password is invalid ${user.email}`)
                    return res.status(403).json({
                        status: res.status,
                        message: 'invalid password'
                    });
                }
                
                if (passwordValidity) {
                    user.hash = user.setPassword(user, newPassword);
                    user.lastModified = Date.now();
                    user.markModified('hash');
                    user.markModified('lastModified');
                    user.save().then((user) => {
                        if (user) {
                            logger.info(`password update request has processed ${user.email}`);
                            return res.status(200).json({
                                status: res.status,
                                message: 'password has updated'
                            });
                        }
                    }).catch(next);
                }
            }
        })
        .catch(next);
    }
}

module.exports = updatePassword;