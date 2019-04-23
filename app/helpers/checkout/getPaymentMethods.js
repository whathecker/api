const logger = require('../../utils/logger');
const adyenAxios = require('../../../axios-adyen');

function getPaymentMethods (req, res, next) {
    if (!req.body.merchantAccount) {
        console.log('param is missing');
        logger.warn('/paymentOptions request has rejected as merchantAccount is missing');
        return res.status(400).json({
            url: '/checkout/paymentOptions',
            responseType: 'error',
            status: 400, 
            message: 'bad request' });
    }

    let payload = req.body;
    console.log(payload)
    adyenAxios.post('/paymentMethods', payload)
        .then((response) => {
            console.log(response.status);
            if (response.status === 200) {
                logger.info('/paymentOptions request was successful');
                return res.status(200).json(response.data);
            }
            console.log(response.data);   
        }).catch(next);
}

module.exports = getPaymentMethods;