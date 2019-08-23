const router = require('express').Router();
const apiAuth = require('../../../middlewares/verifyApikey');
const createApikey = require('../../../controllers/key/createApikey');
const deleteApikey = require('../../../controllers/key/deleteApikey');

router.use(apiAuth);
router.post('/key', createApikey); 
router.delete('/key/:key_id', deleteApikey);

module.exports = router;