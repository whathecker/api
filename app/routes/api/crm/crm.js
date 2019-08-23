const router = require('express').Router();
const apiAuth = require('../../../middlewares/verifyApikey');
const optinToNewsletter = require('../../../controllers/crm/optinToNewsletter');


router.post('/newsletter/optin', apiAuth, optinToNewsletter);

module.exports = router;