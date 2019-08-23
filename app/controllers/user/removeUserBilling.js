const Billing = require('../../models/Billing');
const User = require('../../models/User');
const logger = require('../../utils/logger');
const axiosAdyenRecurring = require('../../../axios-adyen-recurring');

function removeUserBilling (req, res, next) {

    const billingId = req.params.billingId;

    if (!billingId) {
        logger.warn(`removeUserBilling request has rejected | bad request`);
        return res.status(400).json({
            message: 'bad request'
        });
    }

    if (req.user) {
        User.findById(req.user._id)
        .populate('defaultBillingOption')
        .populate('billingOptions')
        .then((user) => {

            if (!user) {
                logger.info(`removeUserBilling request has processed but no user was found | ${user.email}`);
                return res.status(204).json({
                    status: 'failed',
                    message: 'no user'
                });
            }

            if (user) {
                const defaultId = user.defaultBillingOption.billingId;
                const shopperReference = user.userId;
                const merchantAccount = "ChokchokNL";

                if (billingId === defaultId) {
                    logger.warn(`removeUserBilling request has not processed as defaultBillingOption is requested to be deleted | ${user.email}`)
                    return res.status(422).json({
                        status: 'failed',
                        message: 'cannot delete default payment option'
                    });
                }

                if (billingId !== defaultId) {
                    // call adyen to disable
                    // remove billing from data base 
                    Billing.findOne({ billingId: billingId })
                    .then((billing) => {

                        if (!billing) {
                            logger.info(`removeUserBilling request has processed but no billing was found | ${user.email}`);
                            return res.status(204).json({
                                status: 'failed',
                                messasge: 'no billing option'
                            });
                        }

                        if (billing) {
                        
                            const recurringDetailReference = billing.recurringDetail;
                            const payload = {
                                recurringDetailReference: recurringDetailReference,
                                shopperReference: shopperReference,
                                merchantAccount: merchantAccount
                            }

                            axiosAdyenRecurring.post('/disable', payload)
                            .then((response) => {
                                console.log(response);
                                if (response.status !== 200) {
                                    logger.warn(`removeUserBilling request has not processed due to unexpected response from payment processor | ${user.email}`)
                                    return res.status(422).json({
                                        status: 'failed',
                                        message: 'unexpected processing result from payment engine'
                                    });
                                }
                                
                                if (response.status === 200) {

                                    Promise.all([
                                        Billing.findByIdAndDelete(billing._id),
                                        User.findByIdAndUpdate(req.user._id, { 
                                            $pull: { "billingOptions": billing._id },
                                            lastModified: Date.now()
                                        })
                                    ])
                                    .then((values) => {
    
                                        if (values) {
                                            logger.info(`removeUserBilling request has processed and payment method is removed | ${user.email}`);
                                            return res.status(200).json({
                                                status: 'success',
                                                message: 'payment method is delelted',
                                                user: user.email
                                            });
                                        }
    
                                    }).catch(next);
                                }
                                
                            
                            }).catch(next);
        
                        }

                    }).catch(next);
                }

            }

        }).catch(next);

    }
    
}

module.exports = removeUserBilling;