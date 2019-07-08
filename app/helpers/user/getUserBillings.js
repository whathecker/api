const User = require('../../models/User');
const logger = require('../../utils/logger');
const axiosAdyenRecurring = require('../../../axios-adyen-recurring');


/**
 * private method to check if recurring detail is default billing option
 * return true if recurringDetail param is same as defaultRecurringDetail
 * @param {*} defaultRecurringDetail 
 * @param {*} recurringDetail 
 */
function isDefaultBilling (defaultRecurringDetail, recurringDetail) {
    return defaultRecurringDetail === recurringDetail;
}

function getUserBillings (req, res, next) {
    if (req.user) {

        User.findById(req.user._id)
        .populate('defaultBillingOption')
        .populate('billingOptions')
        .populate({
            path: 'subscriptions',
            populate: { path: 'paymentMethod'}
        })
        .then((user) => {
            if (user) {
                console.log(user);
                const defaultBillingOption = user.defaultBillingOption;

                let billingOptions = {
                    card: [],
                    ideal: []
                }

                const payload = {
                    recurring: {
                        contract: "RECURRING"
                    },
                    shopperReference: user.userId,
                    merchantAccount: "ChokchokNL"
                }

                axiosAdyenRecurring.post('/listRecurringDetails', payload)
                .then((response) => {
                    const adyenDetail = response.data.details;
                    console.log(adyenDetail);
                    if (!adyenDetail) {
                        logger.info(`getUserBillings request has processed but no billingOptions to return | ${user.email}`);
                        return res.status(200).json(billingOptions);
                    }

                    for (let i = 0; i < user.billingOptions.length; i++) {
                        console.log(user.billingOptions[i]);

                        const recurringDetail = user.billingOptions[i].recurringDetail;
                        const paymentMethodType = user.billingOptions[i].type;

                        // loop through paymentOptions returned from Adyen
                        // cross-checking to ensure data stored in 2 parties are returned
                        for (let p = 0; p < adyenDetail.length; p++) {
                            console.log(adyenDetail[p].RecurringDetail);
                            const adyenRecurring = adyenDetail[p].RecurringDetail.recurringDetailReference;
                            const creationDate = adyenDetail[p].RecurringDetail.creationDate;
                            
                            if (recurringDetail === adyenRecurring) {
                                let billingOption;

                                switch (paymentMethodType) {

                                    case 'ideal':
                                        billingOption = {
                                            type : paymentMethodType,
                                            recurringDetail: recurringDetail,
                                            creationDate: creationDate,
                                            bank: adyenDetail[p].RecurringDetail.bank,
                                            default: isDefaultBilling(defaultBillingOption.recurringDetail, recurringDetail)
                                        }
                                        billingOptions.ideal.push(billingOption);
                                        break;

                                    default:
                                        billingOption = {
                                            type: paymentMethodType,
                                            recurringDetail: recurringDetail,
                                            creationDate: creationDate,
                                            card: adyenDetail[p].RecurringDetail.card,
                                            default: isDefaultBilling(defaultBillingOption.recurringDetail, recurringDetail)
                                        }
                                        billingOptions.card.push(billingOption);
                                        break;

                                }
                            }
                        }
                    }
                    
                    logger.info(`getUserBillings request has processed and returned data | ${user.email}`);
                    return res.status(200).json(billingOptions);
                    
                }).catch(next);
            }
        }).catch(next);

        
    }
}

module.exports = getUserBillings;