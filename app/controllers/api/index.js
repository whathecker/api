const router = require('express').Router();

router.use('/', require('./user/user'));
router.use('/auth', require('./key/key'));

module.exports = router;