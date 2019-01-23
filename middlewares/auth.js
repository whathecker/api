const Apikey = require('../models/Apikey');

function verifyApikey (req, res, next) {
    //console.log(req.get('apikey'));

    if (!req.get('apikey')) {
        res.status(401).json({ message: 'Request is denied' });
    } else if (req.get('apikey')) {

        Apikey.findOne({ key: req.get('apikey') }).then((key) => {
            if (!key) {
                //console.log('key is not found');
                res.status(401).json({ message: 'Request is denied' });
            }
            next();
        }).catch(next);

    } else {
        next();
    }
}

module.exports = verifyApikey;