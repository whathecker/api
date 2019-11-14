const logger = require('../../utils/logger');
const stripeHelpers = require('../../utils/stripe/stripeHelpers');
const stripe = require('stripe')(stripeHelpers.retrieveApikey());

async function createCheckoutSession (req, res, next) {

    const userId = req.body.userId;
    const email = req.body.email;
    const lineItems = req.body.lineItems;
    const token = req.body.token;

    if (!userId || !email || !lineItems || !token) {
        logger.warn(`createCheckoutSession request has failed | bad request`);
        return res.status(400).json({
            status: 'failed',
            message: 'bad request',
        });
    }

    const mappedLineItems = lineItems.map(item => {
        const enrichedItem = {
            name: item.name,
            description: 'if your skin is in need of hydration and nourishment, look no further. Cure the dryness with sheet masks that are intensely moisturizing and claming.',
            images: ['https://www.hellochokchok.com/static/hellochokchok_sheetmask_intro_2.png'],
            amount: stripeHelpers.convertAmountFormat(item.sumOfGrossPrice),
            currency: stripeHelpers.convertCurrencyFormat(item.currency),
            quantity: item.quantity
        }
        return enrichedItem;
    });

    let success_url;
    let cancel_url;

    if (process.env.NODE_ENV === 'production') {
        success_url =`https://www.hellochokchok.com/overduepayment/success`;
        cancel_url = `https://www.hellochokchok.com/overduepayment?order=${token}`;
    }

    if (process.env.NODE_ENV === "development") {
        success_url =`https://test.hellochokchok.com/overduepayment/success`;
        cancel_url = `https://test.hellochokchok.com/overduepayment?order=${token}`;
    }

    if (process.env.NODE_ENV === "local") {
        success_url =`http://localhost:3000/overduepayment/success`;
       cancel_url = `http://localhost:3000/overduepayment?order=${token}`;
    }

    await stripe.checkout.sessions.create({
        customer: userId,
        payment_method_types: ['card'],
        line_items: mappedLineItems,
        success_url: success_url,
        cancel_url: cancel_url
    })
    .then(session => {
        return res.status(200).json({
            status: 'success',
            message: 'checkout session has created',
            session_id: session.id
        });
    }).catch(next);

} 

module.exports = createCheckoutSession;