const User = require('../../models/User');
const Address = require('../../models/Address');
const Billing = require('../../models/Billing');
const Subscription = require('../../models/Subscription');
const Order = require('../../models/Order');
const crypto = require('crypto');
const logger = require('../../utils/logger');
const adyenAxios = require('../../../axios-adyen');


function processRedirectedPayment (req, res, next) {

    console.log(req.body);
    let payloadToAdyen;
    req.body.details? payloadToAdyen = req.body : null;
    
    console.log(payloadToAdyen);
    adyenAxios.post('/payments/details', payloadToAdyen)
        .then((response) => {
            const resultCode = response.data.resultCode;
            console.log(response.data);

            if (resultCode === "Authorised") {
                // handle success
                return res.status(200).end();
            }

            if (resultCode === "Refused") {

            }

            if (resultCode === "Error") {

            }

            if (resultCode === "Canceled") {

            }

        })
        .catch(next);
}

module.exports = processRedirectedPayment;