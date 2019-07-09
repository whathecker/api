const Billing = require('../../models/Billing');
const User = require('../../models/User');
const Subscription = require('../../models/Subscription');
const logger = require('../../utils/logger');

function updateDefaultBilling (req, res, next) {

    if (req.user) {
        console.log(req.body);
        const billingId = req.body.billingId;

        if (!billingId) {
            logger.warn(`updateDefaultBilling request is rejected | bad request`);
            return res.status(400).json({
                message: 'bad request'
            });
        }

        User.findById(req.user._id)
        .populate('defaultBillingOption')
        .populate('billingOptions')
        .populate('subscriptions')
        .then((user) => {

            if (!user) {
                logger.info(`updateDefaultBilling request has processed but no user was found`);
                return res.status(204).json({
                    status: 'failed',
                    message: 'no user'
                });
            }

            if (user) {
                //console.log(user);
                Billing.findOne({ billingId: billingId })
                .then((billing) => {

                    if (!billing) {
                        logger.info(`updateDefaultBilling request has processed but no billing was found`);
                        return res.status(204).json({
                            status: 'failed',
                            messasge: 'no billing option'
                        });
                    }

                    if (billing) {
                        //console.log(billing._id);
                        user.defaultBillingOption = billing._id;
                        user.markModified('defaultBillingOption');

                        for (let i = 0; i < user.subscriptions.length; i++) {
                            //console.log(user.subscriptions[i]._id);
                            //console.log(user.subscriptions[i].paymentMethod);

                            Subscription.findById(user.subscriptions[i]._id)
                            .then((subscription) => {
                                if (subscription) {
                                    subscription.paymentMethod = billing._id;
                                    subscription.markModified('paymentMethod');
                                    subscription.save();
                                }
                            }).catch(next);

                        }

                        user.save().then(() => {
                            logger.info(`updateDefaultBilling request has processed | new default option ${billingId} | ${user.email}`);
                            return res.status(200).json({
                                status: 'success',
                                message: 'default billing option is updated'
                            });
                        }).catch(next);
                        
                    }

                }).catch(next);
                
            }
        }).catch(next);
    }
}

module.exports = updateDefaultBilling;