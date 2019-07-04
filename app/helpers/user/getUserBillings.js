const User = require('../../models/User');
const Billing = require('../../models/Billing');
const logger = require('../../utils/logger');
const axiosAdyenRecurring = require('../../../axios-adyen-recurring');

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
                    for (let i = 0; i < user.billingOptions.length; i++) {
                        console.log(user.billingOptions[i]);

                        const recurringDetail = user.billingOptions[i].recurringDetail;
                        const paymentMethodType = user.billingOptions[i].type;
                        

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
                                            bank: adyenDetail[p].RecurringDetail.bank
                                        }
                                        billingOptions.ideal.push(billingOption);
                                        break;

                                    default:
                                        billingOption = {
                                            type: paymentMethodType,
                                            recurringDetail: recurringDetail,
                                            creationDate: creationDate,
                                            card: adyenDetail[p].RecurringDetail.card
                                        }
                                        billingOptions.card.push(billingOption);
                                        break;
                                }

                            }
                        }

                    }
                    return res.status(200).json(billingOptions);
                }).catch(next);
            }
        }).catch(next);

        
    }
}

module.exports = getUserBillings;