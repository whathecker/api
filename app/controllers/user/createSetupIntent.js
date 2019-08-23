const stripeHelpers = require('../../utils/stripe/stripeHelpers');
const stripe = require('stripe')(stripeHelpers.retrieveApikey());
const logger = require('../../utils/logger');

async function createSetupIntent (req, res, next) {
    await stripe.setupIntents.create({
        usage: 'off_session'
    })
    .then(intent => {
        console.log(intent);
        logger.info(`createSetupIntent request has processed ${intent.client_secret}`);
        return res.status(200).json({
            status: 'success',
            message: 'setup intent has created',
            client_intent: intent.client_secret
        })
    }).catch(next);
}

module.exports = createSetupIntent;