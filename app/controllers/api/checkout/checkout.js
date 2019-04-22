const router = require('express').Router();
const checkDuplicateEmail = require('../../../helpers/checkout/checkDuplicateEmail');
const getPaymentMethods = require('../../../helpers/checkout/getPaymentMethods');
const completeCheckout = require('../../../helpers/checkout/completeCheckout');
const processRedirectedPayment = require('../../../helpers/checkout/processRedirectedPayment');
const getAddressDetail = require('../../../helpers/checkout/getAddressDetail');
const handleNotification = require('../../../helpers/checkout/handleNotification');

// endpoint to check if email is associated with account or not
router.post('/email', checkDuplicateEmail); 

router.post('/address', getAddressDetail);

router.post('/paymentOptions', getPaymentMethods);

router.post('/payment', completeCheckout);

router.post('/payment/details', processRedirectedPayment)

router.post('/payment/notification', handleNotification);

module.exports = router;    