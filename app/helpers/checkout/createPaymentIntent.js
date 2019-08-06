const stripeHelpers = require('../../utils/stripe/stripeHelpers');
const stripe = require('stripe')(stripeHelpers.retrieveApikey(process.env.NODE_ENV));
const logger = require('../../utils/logger');

async function createPaymentIntent (req, res, next) {
    
    if (!req.body.amount || !req.body.currency) {
        logger.warn('createPaymentIntent request has rejected as param is missing');
        return res.status(400).json({
            url: '/checkout/payment/session',
            responseType: 'error',
            status: 400, 
            message: 'bad request' 
        });
    }
    const amount = stripeHelpers.convertAmountFormat(req.body.amount);
    const currency = stripeHelpers.convertCurrencyFormat(req.body.currency);
    
    await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        setup_future_usage: 'off_session'
    }).then((intent) => {
        console.log(intent);
        logger.info(`createPaymentIntent request has processed ${intent.client_secret} has returned to client`);
        return res.status(200).json({
            url: '/checkout/payment/session',
            status: 'success',
            message: 'payment intent has created',
            client_intent: intent.client_secret
        });
    }).catch(next);
    
}

module.exports = createPaymentIntent;