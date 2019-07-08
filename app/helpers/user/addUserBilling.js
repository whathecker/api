const adyenAxios = require('../../../axios-adyen');
const Billing = require('../../models/Billing');
const User = require('../../models/User');
const logger = require('../../utils/logger');

function addUserBilling (req, res, next) {

    if (req.user) {
        console.log(req.body);

        if (!req.body.billingDetail) {
            logger.warn(`addUserBilling request is rejected | bad request`);
            return res.status(400).json({
                message: 'bad request'
            });
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
                newBilling.type = req.body.type;
                newBilling.billingId = newBilling.setBillingId();
                
                let adyenPayload = req.body.billingDetail;
                // use billingId for non-checkout payment request
                adyenPayload.reference = newBilling.billingId;
                adyenPayload.shopperReference = user.userId;

                adyenAxios.post('/payments', adyenPayload)
                .then((response) => {
                    console.log(response.data);
                    
                    const resultCode = response.data.resultCode;

                    if (resultCode === "Refused") {
                        logger.info(`addUserBilling is refused (no redirect) | ${resultCode} | ${user.email}`);
                        
                        return res.status(200).json({
                            status: 'failed',
                            resultCode: resultCode,
                            message: 'add payment method is refused from payment processer'
                        });
                    }

                    if (resultCode === "Cancelled") {
                        logger.info(`addUserBilling is cancelled (no redirect) | ${resultCode} | ${user.email}`);

                        return res.status(200).json({
                            status: 'failed',
                            resultCode: resultCode,
                            message: 'add payment request is cancelled by user'
                        });
                    }

                    if (resultCode === "Error") {
                        logger.warn(`addUserBilling is failed (no redirect) | ${resultCode} | ${user.email}`);
                        return res.status(500).json({
                            status: 'failed',
                            resultCode: resultCode,
                            message: 'unexpected error in adding payment method'
                        });
                    }

                    if (resultCode === "RedirectShopper") {
                        logger.info(`addUserBilling has been redirected | ${resultCode} | ${user.email}`);
                        return res.statius(202).json({
                            status: 'pending',
                            resultCode: resultCode,
                            message: 'redirect shopper for further processing',
                            redirect: response.data.redirect
                        });
                    }


    
                    if (resultCode === 'Authorised') {
                        

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

module.exports = addUserBilling;