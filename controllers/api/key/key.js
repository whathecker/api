const router = require('express').Router();
const Apikey = require('../../../models/Apikey');
const crypto = require('crypto');


router.post('/key', (req, res, next) => {

    const apikey = new Apikey();
    apikey.name = req.body.name;
    apikey.key = crypto.randomBytes(16).toString('hex');

    apikey.save().then(()=> {
        res.status(201).json({ message: 'success' });
    }).catch(next);

}); 

module.exports = router;