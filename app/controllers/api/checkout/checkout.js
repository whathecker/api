const router = require('express').Router();
const checkDuplicateEmail = require('../../../helpers/checkout/checkDuplicateEmail');
const getPaymentMethods = require('../../../helpers/checkout/getPaymentMethods');
const completeCheckout = require('../../../helpers/checkout/completeCheckout');
const processRedirectedPayment = require('../../../helpers/checkout/processRedirectedPayment');
const getAddressDetail = require('../../../helpers/checkout/getAddressDetail');
const handleNotification = require('../../../helpers/checkout/handleNotification');
const apiAuth = require('../../../middlewares/verifyApikey');

// endpoint to check if email is associated with account or not
router.post('/email', apiAuth, checkDuplicateEmail); 

router.post('/address', apiAuth, getAddressDetail);

router.post('/paymentOptions', apiAuth, getPaymentMethods);

router.post('/payment', apiAuth, completeCheckout);

router.post('/payment/details', apiAuth, processRedirectedPayment)

router.post('/payment/notification', handleNotification);

module.exports = router;    