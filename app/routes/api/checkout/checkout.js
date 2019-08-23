const router = require('express').Router();
const validateEmail = require('../../../controllers/checkout/validateEmail');
const getPaymentMethods = require('../../../controllers/checkout/getPaymentMethods');
const completeCheckout = require('../../../controllers/checkout/completeCheckout');
const processRedirectedPayment = require('../../../controllers/checkout/processRedirectedPayment');
const getAddressDetail = require('../../../controllers/checkout/getAddressDetail');
const handleNotification = require('../../../controllers/checkout/handleNotification');
const getSubscriptionConf = require('../../../controllers/checkout/getSubscriptionConf');
const apiAuth = require('../../../middlewares/verifyApikey');
const createPaymentIntent = require('../../../controllers/checkout/createPaymentIntent');
const completeCheckoutStripe = require('../../../controllers/checkout/completeCheckoutStripe');
const handleStripeWebhook = require('../../../controllers/checkout/handleStripeWebhook');

// endpoint to check if email is associated with account or not
router.post('/email', apiAuth, validateEmail); 

router.post('/address', apiAuth, getAddressDetail);
router.post('/payment/session', apiAuth, createPaymentIntent); 
router.post('/payment/confirmation', apiAuth, completeCheckoutStripe);
router.post('/payment/hook', handleStripeWebhook);

// adyen checkout endpoints
router.post('/paymentOptions', apiAuth, getPaymentMethods);
router.post('/payment', apiAuth, completeCheckout);
router.post('/payment/details', apiAuth, processRedirectedPayment)
router.post('/payment/notification', handleNotification);

router.get('/subscription/:subscriptionId', apiAuth, getSubscriptionConf);

module.exports = router;    