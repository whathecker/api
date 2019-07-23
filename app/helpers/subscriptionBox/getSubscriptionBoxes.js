const SubscriptionBox = require('../../models/SubscriptionBox');
const logger = require('../../utils/logger');

function getSubscriptionBoxes (req, res, next) {
    SubscriptionBox.find()
    .populate('items')
    .then((box) => {
        if (!box) {
            logger.warn(`getSubscriptionBoxes request has failed | no box found`);
            return res.status(204).json({
                status: 'failed',
                message: 'no data'
            });
        }

        if (box) {
            logger.info(`getSubscriptionBoxes request has processed`);
            return res.status(200).json(box);
        }
    }).catch(next);
}

module.exports = getSubscriptionBoxes;