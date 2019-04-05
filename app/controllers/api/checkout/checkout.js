const router = require('express').Router();
const checkDuplicateEmail = require('../../../helpers/checkout/checkDuplicateEmail');
const getPaymentMethods = require('../../../helpers/checkout/getPaymentMethods');
const completeCheckout = require('../../../helpers/checkout/completeCheckout');

// endpoint to check if email is associated with account or not
router.post('/email', checkDuplicateEmail); 

router.post('/paymentOptions', getPaymentMethods);

router.post('/payment', completeCheckout);

module.exports = router;    