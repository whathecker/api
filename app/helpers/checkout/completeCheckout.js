const User = require('../../models/User');
const crypto = require('crypto');
const logger = require('../../utils/logger');


function completeCheckout (req, res, next) {
    console.log(req.body);
    return res.status(200).end();
}

module.exports = completeCheckout;