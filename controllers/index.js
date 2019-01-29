const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('hello world');
});

router.use('/api', require('./api'));

module.exports = router;