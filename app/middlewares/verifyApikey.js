const Apikey = require('../models/Apikey');

function verifyApikey (req, res, next) {
    //console.log(req.get('apikey'));

    if (!req.get('X-API-Key')) {
        return res.status(401).json({ message: 'unauthroized' });
    } else if (req.get('X-API-Key')) {
        Apikey.findOne({ key: req.get('X-API-Key') })
        .then((key) => {
            if (!key) {
                return res.status(401).json({ message: 'unauthroized' });
            } 
            if (key) {
                next();
            }
        }).catch(next);
    } 
}

module.exports = verifyApikey;