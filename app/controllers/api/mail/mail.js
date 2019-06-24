const router = require('express').Router();
const apiAuth = require('../../../middlewares/verifyApikey');
const sendTransactionalEmail = require('../../../helpers/mail/sendTransactionalEmail');
const sendForgotPasswordEmail = require('../../../helpers/mail/sendForgotPasswordEmail');

router.post('/send', apiAuth, sendTransactionalEmail);
router.post('/send/forgotpassword', apiAuth, sendForgotPasswordEmail);

module.exports = router;