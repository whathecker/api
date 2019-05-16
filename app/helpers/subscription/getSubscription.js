const Subscription = require('../../models/Subscription');
const logger = require('../../utils/logger');
function getSubscription (req, res, next) {
    
    const subscriptionId = req.params.subscriptionId;
    console.log(subscriptionId);

    if (!subscriptionId) {
        logger.warn('/subscriptions/subscription request returned 422, parameter is missing');
        return res.status(422).json({
            status: res.status,
            message: 'bad request: missing parameter'
        });
    } else {
        Subscription.findOne({ subscriptionId: subscriptionId }).populate('user')
        .then((subscription) => {
            console.log(subscription);
            
            if (subscription) {
                logger.info('/subscriptions/subscription request returned 200');
                return res.status(200).json({
                    status: res.status,
                    message: 'subscription has returned',
                    subscriptionId: subscription.subscriptionId,
                    userEmail: subscription.user.email
                });
            } else {
                logger.info('/subscriptions/subscription request returned 204, no data found')
                return res.status(204).json({
                    status: res.status,
                    message: 'subscription not found'
                });
            }
        }).catch(next);
    }
}

module.exports = getSubscription;