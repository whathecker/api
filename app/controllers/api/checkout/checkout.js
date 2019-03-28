const router = require('express').Router();
const logger = require('../../../utils/logger');
const User = require('../../../models/User');

// endpoint to check if email is associated with account or not

router.post('/email',  (req, res, next) => {
    // find if account exist with email address
    console.log(req.body.email);
    if (req.body.email) {
        User.findOne({ email: req.body.email })
            .then((user) => {
                if (!user) {
                    logger.warn('request was okay, but no user has found');
                    return res.status(204).json({ message: 'cannot find user' });
                }
                logger.info('request has succeed');
                return res.status(200).json({ message: 'email being used' });
            }).catch(next);
    } else {
        return res.status(400).json({ message: 'bad request' });
    } 
});

module.exports = router;