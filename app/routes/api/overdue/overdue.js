const router = require('express').Router();
const apiAuth = require('../../../middlewares/verifyApikey');
const getOverdueOrder = require('../../../controllers/overdue/getOverdueOrder');
const createCheckoutSession = require('../../../controllers/overdue/createCheckoutSession');

router.use(apiAuth);
router.get('/order/:token', getOverdueOrder);
router.post('/payment/session', createCheckoutSession);

module.exports = router;