const User = require('../../models/User');
const Subscription = require('../../models/Subscription');
const logger = require('../../utils/logger');

function updateDeliverySchedules (req, res, next) {

    if (!req.body.subscription || !req.body.subscription.subscriptionId 
        ||!req.body.subscription.deliveryFrequency ||!req.body.subscription.isActive) {

        logger.error(`updateDeliverySchedules request is failed | bad request`);
        return res.status(400).json({
            status: 'failed',
            message: 'bad request'
        });

    }

    const subscriptionId = req.body.subscription.subscriptionId;

    User.findById(req.user._id)
    .populate({
        path: 'subscriptions',
        populate: { path: 'paymentMethod' }
    })
    .then(user => {

        if (!user) {
            logger.warn(`updateDeliverySchedules request is failed | unknown user`);
            return res.status(422).json({
                status: 'failed',
                message: 'unknown user'
            });
        }

        if (user && !user.subscriptions[0]) {
            logger.warn(`updateDeliverySchedules request is failed | no subscription | ${subscriptionId}`);
            return res.status(422).json({
                status: 'failed',
                message: 'no subscription'
            });
        }

        if (user && user.subscriptions[0]) {

            if (subscriptionId !== user.subscriptions[0].subscriptionId) {
                logger.warn(`updateDeliverySchedules request is failed | incorrect subscription id | ${subscriptionId}`);
                return res.status(422).json({
                    status: 'failed',
                    message: 'incorrect subscription id'
                });
            }

            const deliveryFrequency = req.body.subscription.deliveryFrequency;
                    
            Subscription.findOne({ subscriptionId: subscriptionId })
            .then(subscription => {

                if (subscription && !subscription.isActive) {

                    logger.warn(`updateDeliverySchedules request is failed | inactive subscription | ${subscriptionId}`);
                    return res.status(422).json({
                        status: 'failed',
                        message: 'inactive subscription'
                    });

                }

                if (subscription && subscription.isActive) {

                    subscription.deliveryFrequency = subscription.convertDeliveryFreqToInt(deliveryFrequency);
                    subscription.markModified('deliveryFrequency');

                    let newDeliverySchedules = Array.from(subscription.deliverySchedules);
                    const newDeliveryDate = subscription.setDeliverySchedule(newDeliverySchedules[0].nextDeliveryDate, subscription.deliveryFrequency, subscription.deliveryDay);
                    newDeliverySchedules[1] = newDeliveryDate;

                    subscription.deliverySchedules = newDeliverySchedules; 
                    subscription.markModified('deliverySchedules');

                    subscription.lastModified = Date.now();
                    subscription.markModified('lastModified');
                    
                    subscription.save().then(subscription => {

                        logger.warn(`updateDeliverySchedules request is processed | delivery schedules has updated | ${subscriptionId}`);
                        return res.status(200).json({
                            status: 'success',
                            message: 'delivery schedule has updated'
                        });

                    }).catch(next);

                }
                
            })
            .catch(next);

        }

    }).catch(next);
}

module.exports = updateDeliverySchedules;