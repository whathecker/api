const stripeHelpers = require('../../utils/stripe/stripeHelpers');
const stripe = require('stripe')(stripeHelpers.retrieveApikey());
const User = require('../../models/User');
const Billing = require('../../models/Billing');
const logger = require('../../utils/logger');

async function addUserBillingStripe (req, res, next) {
    const setupIntent = req.body.setupIntent;

    const stripePaymentMethod = await stripe.paymentMethods.retrieve(setupIntent.payment_method);

    if (!setupIntent) {
        logger.warn('addUserBillingStripe request has rejected as param is missing');
        return res.status(400).json({
            responseType: 'error',
            status: 400, 
            message: 'bad request' 
        });
    }

    if (req.user) {
        User.findById(req.user._id)
        .populate('defaultBillingOption')
        .populate('billingOptions')
        .then(user => {
            if (!user) {
                logger.info(`addUserBillingStripe request has processed but no user was found`);
                return res.status(204).json({
                    status: 'failed',
                    messsage: 'no content',
                });
            }

            if (user) {
                let newBilling = new Billing();
                newBilling.user = req.user._id;
                newBilling.billingId = setupIntent.payment_method;
                (setupIntent.payment_method_types[0] === 'card')? newBilling.type = stripePaymentMethod.card.brand : null;
                
                user.billingOptions.push(newBilling);
                user.lastModified = Date.now();
                user.markModified('billingOptions');
                user.markModified('lastModified');
                
                Promise.all([
                    newBilling.save(),
                    user.save(),
                    stripe.paymentMethods.attach(
                        setupIntent.payment_method,
                        { customer: user.userId }
                    )
                ])
                .then(values => {
                    if (values) {
                        logger.info(`addUserBillingStripe request has processed | added ${newBilling.billingId} in db | ${user.email}`);
                        return res.status(201).json({
                            status: 'success',
                            messsage: 'new payment method is added',
                            user: user.email
                        });
                    }
                }).catch(next);
            }

        })
    }
}

module.exports = addUserBillingStripe;