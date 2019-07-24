const Subscription = require('../../models/Subscription');
const logger = require('../../utils/logger');

function getSubscriptions (req, res, next) {
    
    Subscription.find()
    .populate('user', 'email userId')
    .populate('paymentMethod')
    .populate('orders')
    .then(subscriptions => {
        if (!subscriptions) {
            logger.warn(`getSubscriptions request has failed | no box found`);
            return res.status(422).json({
                status: 'failed',
                message: 'no data'
            });
        } 
        if (subscriptions) {
        
            logger.info(`getSubscriptions request has processed`);
            return res.status(200).json({
                status: 'success',
                subscriptions: subscriptions,
                message: 'subscriptions returned'
            });
        }
    }).catch(next);
}

module.exports = getSubscriptions;