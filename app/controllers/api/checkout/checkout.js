const router = require('express').Router();
const checkDuplicateEmail = require('../../../helpers/checkout/checkDuplicateEmail');
const getPaymentMethods = require('../../../helpers/checkout/getPaymentMethods');
const completeCheckoutbyCard = require('../../../helpers/checkout/completeCheckoutbyCard');

// endpoint to check if email is associated with account or not
router.post('/email', checkDuplicateEmail); 

router.post('/paymentOptions', getPaymentMethods);

router.post('/payment/card', completeCheckoutbyCard);

module.exports = router;    