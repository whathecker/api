const router = require('express').Router();
const apiAuth = require('../../../middlewares/verifyApikey');
const sendTransactionalEmail = require('../../../helpers/mail/sendTransactionalEmail');

router.post('/send', apiAuth, sendTransactionalEmail);

module.exports = router;