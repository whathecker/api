const router = require('express').Router();
const validateEmail = require('../../../helpers/checkout/validateEmail');
const getPaymentMethods = require('../../../helpers/checkout/getPaymentMethods');
const completeCheckout = require('../../../helpers/checkout/completeCheckout');
const processRedirectedPayment = require('../../../helpers/checkout/processRedirectedPayment');
const getAddressDetail = require('../../../helpers/checkout/getAddressDetail');
const handleNotification = require('../../../helpers/checkout/handleNotification');
const getSubscriptionConf = require('../../../helpers/checkout/getSubscriptionConf');
const apiAuth = require('../../../middlewares/verifyApikey');
const createPaymentIntent = require('../../../helpers/checkout/createPaymentIntent');
const completeCheckoutStripe = require('../../../helpers/checkout/completeCheckoutStripe');

// endpoint to check if email is associated with account or not
router.post('/email', apiAuth, validateEmail); 

router.post('/address', apiAuth, getAddressDetail);
router.post('/payment/session', apiAuth, createPaymentIntent); 
router.post('/payment/confirmation', apiAuth, completeCheckoutStripe);

router.post('/paymentOptions', apiAuth, getPaymentMethods);
router.post('/payment', apiAuth, completeCheckout);
router.post('/payment/details', apiAuth, processRedirectedPayment)
router.post('/payment/notification', handleNotification);

router.get('/subscription/:subscriptionId', apiAuth, getSubscriptionConf);

module.exports = router;    