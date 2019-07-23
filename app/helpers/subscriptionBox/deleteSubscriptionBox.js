const SubscriptionBox = require('../../models/SubscriptionBox');
const logger = require('../../utils/logger');

function deleteSubscriptionBox (req, res, next) {
    if (!req.params.id) {
        logger.warn('deleteSubscriptionBox request has rejected as id param is missing');
        return res.status(400).json({ 
            status: 'failed',
            message: 'bad request' 
        });
    }
    if (req.params.id) {
        SubscriptionBox.findOneAndRemove({ id: req.params.id })
        .then((box) => {
            if (!box) {
                logger.warn('deleteSubscriptionBox request has rejected as product is unknown')
                return res.status(422).json({ 
                    status: 'failed',
                    message: 'can not find subscriptionBox' 
                })
            }
            logger.info(`deleteSubscriptionBox request has succeed: ${box.id}`);
            return res.status(200).json({
                status: 'success',
                message: 'subscriptionBox has removed'
            });
        }).catch(next);
    }
}

module.exports = deleteSubscriptionBox;