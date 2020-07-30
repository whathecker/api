const helpers = require('./helpers');
const apikey = helpers.retrieveApikey();
const stripe = require('stripe')(apikey);

const createSession = async ({
    amount,
    currency,
    isRecurring
} = {}) => {

    if (!amount || !currency) {
        return Promise.reject({
            status: "fail",
            message: "bad request"
        });
    }
    
    try {
        let payload = {};
        payload.amount = helpers.convertAmountFormat(amount);;
        payload.currency = helpers.convertCurrencyFormat(currency);
        (isRecurring === true)? payload.setup_future_usage = 'off_session' : null;

        const paymentSession = await stripe.paymentIntents.create(payload);
        
        return Promise.resolve({
            status: "success",
            message: "payment session created",
            session: paymentSession.client_secret
        });

    } catch (exception) {
        return Promise.reject({
            status: "fail",
            message: "error",
            error: exception.message
        });
    }
};

const getPaymentMethod = async () => {

}; 

module.exports = {
    createSession,
    getPaymentMethod
};