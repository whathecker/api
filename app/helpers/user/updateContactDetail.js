const User = require('../../models/User');
const logger = require('../../utils/logger');

function updateContactDetail (req, res, next) {
    
    console.log(req.body);
    
    if (req.user) {
        const options = { new: true };

        User.findByIdAndUpdate(req.user._id, req.body, options)
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