const adyenAxios = require('../../../axios-adyen');
const Billing = require('../../models/Billing');
const User = require('../../models/User');
const logger = require('../../utils/logger');

function addRedirectedBilling (req, res, next) {

    if (!req.body.details) {
        return res.status(400).json({
            status: res.status,
            message: 'bad request',
        });
    }

    if (req.user) {
        console.log(req.body);
        const payload = {
            details: req.body.details
        }

        User.findById(req.user._id)
        .populate('defaultBillingOption')
        .populate('billingOptions')
        .then((user) => {
            if (!user) {
                logger.info(`addUserBilling request has processed but no user was found`);
                return res.status(204).json({
                    status: 'failed',
                    messsage: 'no content',
                });
            }

            if (user) {
                let newBilling = new Billing();
                newBilling.user = req.user._id;
                newBilling.type = null; /** updated later from adyen response */
                newBilling.billingId = null; /** updated later from adyen response */
                newBilling.tokenRefundStatus = 'REQUIRED';
                
                adyenAxios.post('/payments/details', payload)
                .then((response) => {
                    console.log(response.data);
                    const resultCode = response.data.resultCode;

                    if (resultCode === "Refused") {
                        logger.info(`addUserBilling is refused (redirect) | ${resultCode} | ${user.email}`);
                        
                        return res.status(200).json({
                            status: 'failed',
                            resultCode: resultCode,
                            message: 'add payment method is refused from payment processer'
                        });
                    }

                    if (resultCode === "Cancelled") {
                        logger.info(`addUserBilling is cancelled (redirect) | ${resultCode} | ${user.email}`);

                        return res.status(200).json({
                            status: 'failed',
                            resultCode: resultCode,
                            message: 'add payment request is cancelled by user'
                        });
                    }
                    
                    if (resultCode === "Error") {
                        logger.warn(`addUserBilling is failed (redirect) | ${resultCode} | ${user.email}`);
                        return res.status(500).json({
                            status: 'failed',
                            resultCode: resultCode,
                            message: 'unexpected error in adding payment method'
                        });
                    }

                    if (resultCode === "Authorised" || resultCode === "Received") {
                        const billingId = response.data.merchantReference;
                        const paymentType = response.data.paymentMethod;
                        newBilling.type = paymentType;
                        newBilling.billingId = billingId;
                        user.billingOptions.push(newBilling);
                        user.markModified('billingOptions');
                        Promise.all([
                            newBilling.save(),
                            user.save()
                        ])
                        .then((values) => {
                            if (values) {
                                logger.info(`addUserBilling request has processed | added ${newBilling.billingId} in db | ${user.email}`);
                                return res.status(201).json({
                                    status: 'success',
                                    resultCode: resultCode,
                                    messsage: 'new payment method is added',
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

module.exports = addRedirectedBilling;