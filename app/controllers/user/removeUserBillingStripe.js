const stripeHelpers = require('../../utils/stripe/stripeHelpers');
const stripe = require('stripe')(stripeHelpers.retrieveApikey());
const User = require('../../models/User');
const Billing = require('../../models/Billing');
const logger = require('../../utils/logger');

async function removeUserBillingStripe (req, res, next) {
    const billingId = req.params.billingId;

    if (!billingId) {
        logger.warn(`removeUserBillingStripe request has rejected | bad request`);
        return res.status(400).json({
            status: 'failed',
            message: 'bad request'
        });
    }

    if (req.user) {
        User.findById(req.user._id)
        .populate('defaultBillingOption')
        .populate('billingOptions')
        .then(user => {
            if (!user) {
                logger.info(`removeUserBillingStripe request has processed but no user was found | ${user.email}`);
                return res.status(204).json({
                    status: 'failed',
                    message: 'no user'
                });
            }

            if (user) {
                const defaultId = user.defaultBillingOption.billingId;

                if (billingId === defaultId) {
                    logger.warn(`removeUserBillingStripe request has not processed as defaultBillingOption is requested to be deleted | ${user.email}`)
                    return res.status(422).json({
                        status: 'failed',
                        message: 'cannot delete default payment option'
                    });
                }

                if (billingId !== defaultId) {

                    Billing.findOne({ billingId: billingId })
                    .then(billing => {
                        
                        if (!billing) {
                            logger.info(`removeUserBillingStripe request has processed but no billing was found | ${user.email}`);
                            return res.status(204).json({
                                status: 'failed',
                                messasge: 'no billing option'
                            });
                        }

                        if (billing) {
                            stripe.paymentMethods.detach(billingId)
                            .then(paymentMethod => {
                                Promise.all([
                                    Billing.findByIdAndDelete(billing._id),
                                    User.findByIdAndUpdate(req.user._id, {
                                        $pull: { "billingOptions": billing._id },
                                        lastModified: Date.now()
                                    })
                                ])
                                .then(values => {
                                    if (values) {
                                        logger.info(`removeUserBillingStripe request has processed and payment method is removed | ${user.email}`);
                                        return res.status(200).json({
                                            status: 'success',
                                            message: 'payment method is delelted',
                                            user: user.email
                                        });
                                    }
                                }).catch(next);

                            }).catch(next);
                        }
                    })
                    
                    
                }
            }
        })
    }
}

module.exports = removeUserBillingStripe;