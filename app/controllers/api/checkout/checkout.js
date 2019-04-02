const router = require('express').Router();
const logger = require('../../../utils/logger');
const User = require('../../../models/User');
const adyenAxios = require('../../../../axios-adyen');

// endpoint to check if email is associated with account or not

router.post('/email',  (req, res, next) => {
    // find if account exist with email address
    console.log(req.body.email);
    if (req.body.email) {
        User.findOne({ email: req.body.email })
            .then((user) => {
                if (!user) {
                    logger.warn('request was okay, but no user has found');
                    return res.status(204).json({ message: 'cannot find user' });
                }
                logger.info('request has succeed');
                return res.status(200).json({ message: 'email being used' });
            }).catch(next);
    } else {
        return res.status(400).json({ message: 'bad request' });
    } 
});

router.post('/paymentOptions', (req, res, next) => {

    if (!req.body.merchantAccount) {
        console.log('param is missing');
        logger.warn('/paymentOptions request has rejected as merchantAccount is missing');
        return res.status(400).json({
            url: '/checkout/paymentOptions',
            responseType: 'error',
            status: 400, 
            message: 'bad request' });
    }

    let payload = req.body;

    adyenAxios.post('/paymentMethods', payload)
        .then((response) => {
            console.log(response.status);
            if (response.status === 200) {
                logger.info('/paymentOptions request was successful');
                return res.status(200).json(response.data);
            }
            console.log(response.data);   
        })
        .catch(next);
});

module.exports = router;