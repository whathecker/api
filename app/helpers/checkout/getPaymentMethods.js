const logger = require('../../utils/logger');
const adyenAxios = require('../../../axios-adyen');

function getPaymentMethods (req, res, next) {
    if (!req.body.merchantAccount) {
        logger.warn('/paymentOptions request has rejected as merchantAccount is missing');
        return res.status(400).json({
            url: '/checkout/paymentOptions',
            responseType: 'error',
            status: 400, 
            message: 'bad request' 
        });
    }

    let payload = req.body;
    adyenAxios.post('/paymentMethods', payload)
        .then((response) => {
            if (response.status === 200) {

                let paymentMethods = [];
                response.data.paymentMethods.forEach(e => {
                    if (e.type !== 'sepadirectdebit') {
                        paymentMethods.push(e);
                    }
                });
                const data = {
                    groups: response.data.groups,
                    paymentMethods: paymentMethods
                }
                
                logger.info('/paymentOptions request was successful');
                return res.status(200).json(data);
            }
            
        }).catch(next);
}

module.exports = getPaymentMethods;