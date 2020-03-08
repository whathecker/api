const User = require('../../models/User');
const logger = require('../../utils/logger');

function deleteUser (req, res, next) {

    const email = req.body.email;

    if (!email) {
        logger.warn(`deleteUser request has failed | bad request | ${email}`);
        return res.status(400).json({ 
            status: 'failed',
            message: 'bad request' 
        });
    }

    User.findOneAndRemove({ email: email })
    .then((user) => {
        if (!user) { 
            logger.warn(`deleteUser request has failed | unknown email | ${email}`);
            return res.status(204).json({ 
                status: 'failed',
                message: 'can not find user'
            }); 
        }
        if (user) {
            logger.warn(`deleteUser request has processed | ${email}`);
            return res.status(200).json({ 
                status: 'success',
                message: 'user has deleted' 
            });
        }
        
    }).catch(next);

}

module.exports = deleteUser;