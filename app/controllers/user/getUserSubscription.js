const User = require('../../models/User');
const logger = require('../../utils/logger');


async function getUserSubscription (req, res, next) {

    User.findById(req.user._id)
    .populate({
        path: 'subscriptions',
        populate: { path: 'paymentMethod'}
    })
    .then(user => {
        console.log(user);
        console.log(user.subscriptions[0])
        return res.status(200).end();
    }).catch(next);
}

module.exports = getUserSubscription;