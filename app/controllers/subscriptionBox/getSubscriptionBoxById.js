const SubscriptionBox = require('../../models/SubscriptionBox');
const logger = require('../../utils/logger');

function getSubscriptionBoxById (req, res, next) {
    SubscriptionBox.findOne({ id: req.params.id })
    .populate('items')
    .then((box) => {
        if (!box) {
            logger.warn(`getSubscriptionBoxById request is failed | unknown id`);
            return res.status(422).json({
                status: 'failed',
                message: 'unknown package id'
            });
        }

        if (box) {
            logger.info(`getSubscriptionBoxById request is processed | ${box.id}`);
            return res.status(200).json({
                status: 'success',
                subscriptionBox: box,
                message: 'package is returned'
            });
        }
    }).catch(next);
}

module.exports = getSubscriptionBoxById;