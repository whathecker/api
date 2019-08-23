const router = require('express').Router();
const Apikey = require('../../../models/Apikey');
const crypto = require('crypto');
const logger = require('../../../utils/logger');
const apiAuth = require('../../../middlewares/verifyApikey');

router.use(apiAuth);

router.post('/key', (req, res, next) => {

    if (!req.body.name) {
        return res.status(400).json({ message: 'bad request' });
    }

    const apikey = new Apikey();
    apikey.name = req.body.name;
    apikey.key = crypto.randomBytes(16).toString('hex');

    apikey.save().then(()=> {
        logger.info(`apikey is successfully created, key: ${apikey.key}`);
        res.status(201).json({ message: 'success' });
    }).catch(next);

}); 

router.delete('/key', (req, res, next) => {

    if (!req.body.name) {
        logger.warn('key delete request has rejected as key param is missing');
        return res.status(400).json({ message: 'bad request' });
    }

    Apikey.findOneAndRemove({ name: req.body.name })
        .then((key)=> {
            if (!key) { 
                logger.warn('key delete request has rejected as key is unknown')
                return res.status(204).json({ message: 'can not find key'}); 
            }
            logger.info('key delete request has succeed');
            return res.status(200).json({ message: 'success' });
        }).catch(next);

})

module.exports = router;