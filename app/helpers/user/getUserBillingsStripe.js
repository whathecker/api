const User = require('../../models/User');
const logger = require('../../utils/logger');
const stripeHelpers = require('../../utils/stripe/stripeHelpers');
const stripe = require('stripe')(stripeHelpers.retrieveApikey(process.env.NODE_ENV));



/**
 * private method to check if recurring detail is default billing option
 * return true if recurringDetail param is same as defaultRecurringDetail
 * @param {*} defaultBillingId 
 * @param {*} billingId 
 */
function isDefaultBilling (defaultBillingId, billingId) {
    return defaultBillingId === billingId;
}


function getUserBillingsStripe (req, res, next) {
    if (req.user) {
        User.findById(req.user._id)
        .populate('defaultBillingOption')
        .populate('billingOptions')
        .populate({
            path: 'subscriptions',
            populate: { path: 'paymentMethod'}
        })
        .then(user => {
            //console.log(user);
            if (user) {
                const defaultBillingId = user.defaultBillingOption.billingId;

                let billingOptions = {
                    card: [],
                };

                stripe.paymentMethods.list({
                    customer: user.userId, type: "card"
                })
                .then(paymentMethods => {

                    if (!paymentMethods) {
                        logger.info(`getUserBillings request has processed but no billingOptions to return | ${user.email}`);
                        return res.status(200).json({
                            status: 'failed',
                            billingOptions: billingOptions
                        });
                    }
                    
                    const stripeBilingOptions =  paymentMethods.data;
                    
                    user.billingOptions.forEach(option => {
                        const billingId = option.billingId;
    
                        stripeBilingOptions.forEach(optionInStripe => {
                            const billingIdInStripe = optionInStripe.id;
                            if (billingId === billingIdInStripe) {
                                const billingOption = {
                                    type: optionInStripe.card.brand,
                                    billingId: optionInStripe.id,
                                    card: {
                                        number: optionInStripe.card.last4,
                                        expiryMonth: optionInStripe.card.exp_month,
                                        expiryYear: optionInStripe.card.exp_year,
                                        country: optionInStripe.card.country,
                                    },
                                    default: isDefaultBilling(defaultBillingId, billingId)
                                }
                                billingOptions.card.push(billingOption);
                            }
                        });
    
                    });
                    console.log(billingOptions);
                    logger.info(`getUserBillings request has processed and returned data | ${user.email}`);
                    return res.status(200).json({
                        status: 'success',
                        billingOptions: billingOptions
                    });
                })
            }
            
            
        }).catch(next);
    }
}

module.exports = getUserBillingsStripe;