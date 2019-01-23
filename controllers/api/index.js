const router = require('express').Router();

router.use('/', require('./user'));
router.use('/auth', require('./key'));

module.exports = router;