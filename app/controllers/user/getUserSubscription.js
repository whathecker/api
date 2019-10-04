const User = require('../../models/User');
const logger = require('../../utils/logger');


async function getUserSubscription (req, res, next) {

    User.findById(req.user._id)
    .populate({
        path: 'subscriptions',
        populate: { path: 'paymentMethod'}
    })
    .then(user => {

        if (!user) {
            logger.warn(`getUserSubscription request is failed | unknown user`);
            return res.status(422).json({
                status: 'failed',
                message: 'unknown user'
            });
        }

        if (user && !user.subscriptions[0]) {
            logger.warn(`getUserSubscription request is failed | no subscription`);
            return res.status(422).json({
                status: 'failed',
                message: 'no subscription'
            });
        }

        if (user && user.subscriptions[0]) {

            const subscription = {
                channel: user.subscriptions[0].channel,
                deliveryFrequency: user.subscriptions[0].deliveryFrequency,
                deliveryDay: user.subscriptions[0].deliveryDay,
                isActive: user.subscriptions[0].isActive,
                creationDate: user.subscriptions[0].creationDate,
                lastModified: user.subscriptions[0].lastModified,
                deliverySchedules: user.subscriptions[0].deliverySchedules,
                subscriptionId: user.subscriptions[0].subscriptionId
            }
            logger.info(`getUserSubscription request is processed | ${subscription.subscriptionId} has returned`)
            return res.status(200).json({
                status: 'success',
                subscription: subscription,
                message: 'subscription is returned'
            });
        }
        
    }).catch(next);
}

module.exports = getUserSubscription;