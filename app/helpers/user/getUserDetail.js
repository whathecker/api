const User = require('../../models/User');
const logger = require('../../utils/logger');


function getUserDetail (req, res, next) {
    
    if (req.user) {
        User.findById(req.user._id)
        .populate('defaultShippingAddress')
        .populate({
            path: 'subscriptions',
            populate: { path: 'package'}
        })
        .then((user) => {
            if (user) {
                //console.log(user);
                //console.log(user.subscriptions[0])
                //console.log(user.subscriptions[0].package)
                const userData = {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    mobileNumber: user.mobileNumber,
                    address: {
                        streetName: user.defaultShippingAddress.streetName,
                        houseNumber: user.defaultShippingAddress.houseNumber,
                        houseNumberAdd: user.defaultShippingAddress.houseNumberAdd,
                        city: user.defaultShippingAddress.city,
                        province: user.defaultShippingAddress.province,
                        country: user.defaultShippingAddress.country
                    },
                    subscription: {
                        id: user.subscriptions[0].subscriptionId,
                        creationDate: user.subscriptions[0].creationDate
                    },
                    package: {
                        id: user.subscriptions[0].package.id,
                        boxType: user.subscriptions[0].package.boxType
                    }
                }
                logger.info(`get user request has returned user ${user.email}`);
                return res.status(200).json(userData);
            } else {
                logger.info(`get user request has not returned user`);
                return res.status(204).json({
                    status: res.status,
                    message: 'no user'
                });
            }
        }).catch(next);
    }
}

module.exports = getUserDetail;