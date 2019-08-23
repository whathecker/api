const Subscription = require('../../models/Subscription');
const logger = require('../../utils/logger');

function getSubscriptionById (req, res, next) {

    Subscription.findOne({ subscriptionId: req.params.id })
    .populate('user', 'email userId')
    .populate('paymentMethod')
    .populate('orders')
    .then((subscription) => {
        if (!subscription) {
            logger.warn(`getSubscriptionById request is failed | unknown id`);
            return res.status(422).json({
                status: 'failed',
                message: 'unknown subscription id'
            });
        }
        if (subscription) {
            logger.info(`getSubscriptionById request is processed | ${subscription.subscriptionId}`);
            return res.status(200).json({
                status: 'success',
                subscription: subscription,
                message: 'subscription is returned'
            });
        }
    }).catch(next);
}

module.exports= getSubscriptionById;