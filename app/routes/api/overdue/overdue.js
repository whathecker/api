const router = require('express').Router();
const apiAuth = require('../../../middlewares/verifyApikey');
const getOverdueOrder = require('../../../controllers/overdue/getOverdueOrder');

router.use(apiAuth);

router.get('/order/:token', getOverdueOrder);

module.exports = router;