const User = require('../../models/User');
const logger = require('../../utils/logger');

function updateContactDetail (req, res, next) {

    if (!req.body.firstName || !req.body.lastName || !req.body.mobileNumber) {
        logger.warn(`updateContactDetail request has failed: bad request`)
        return res.status(400).json({
            status: 'failed',
            message: 'bad request'
        });
    }

    let update = req.body;
    update.lastModified = Date.now();
    
    if (req.user) {
        const options = { new: true };

        User.findByIdAndUpdate(req.user._id, update, options)
        .then((user) => {
            if (user) {
                logger.info(`updateContactDetail request has processed ${user.email}`)
                return res.status(200).json({
                    status: res.status,
                    message: 'user contact detail has updated'
                });
            } else {
                logger.info(`updateContactDetail request has not returned user`);
                return res.status(204).json({
                    status: res.status,
                    message: 'no user'
                });
            }
        }).catch(next);
    } 
}

module.exports = updateContactDetail;