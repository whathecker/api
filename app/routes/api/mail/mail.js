const router = require('express').Router();
const apiAuth = require('../../../middlewares/verifyApikey');
const sendTransactionalEmail = require('../../../controllers/mail/sendTransactionalEmail');
const sendForgotPasswordEmail = require('../../../controllers/mail/sendForgotPasswordEmail');

router.post('/send', apiAuth, sendTransactionalEmail);
router.post('/send/forgotpassword', apiAuth, sendForgotPasswordEmail);

module.exports = router;