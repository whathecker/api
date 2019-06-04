const User = require('../../models/User');
const logger = require('../../utils/logger');

function getUserAddresses (req, res, next) {

    if (req.user) {
        User.findById(req.user._id)
        .populate('defaultShippingAddress')
        .populate('defaultBillingAddress')
        .populate('addresses')
        .then((user) => {
            if (user) {
                console.log(user);
                
                
                let addresses = [];
                for (let i = 0; i < user.addresses.length; i++) {
                    let isShippingAddress = false;
                    let isBillingAddress = false;
                    if (user.addresses[i]._id.equals(user.defaultShippingAddress._id)) {
                        console.log('is this called?');
                        isShippingAddress = true;
                    }
                    if (user.addresses[i]._id.equals(user.defaultBillingAddress._id)) {
                        console.log('is this called?');
                        isBillingAddress = true;
                    }
                    const address = {
                        city: user.addresses[i].city,
                        province: user.addresses[i].province,
                        country: user.addresses[i].country,
                        streetName: user.addresses[i].streetName,
                        houseNumber: user.addresses[i].houseNumber,
                        houseNumberAdd: user.addresses[i].houseNumberAdd,
                        postalCode: user.addresses[i].postalCode,
                        firstName: user.addresses[i].firstName,
                        lastName: user.addresses[i].lastName,
                        mobileNumber: user.addresses[i].mobileNumber,
                        isShippingAddress: isShippingAddress,
                        isBillingAddress: isBillingAddress
                    }
                    addresses.push(address);
                }

                const addressData = {
                    addresses: addresses,
                    shippingAddress: {
                        city: user.defaultShippingAddress.city,
                        province: user.defaultShippingAddress.province,
                        country: user.defaultShippingAddress.country,
                        streetName: user.defaultShippingAddress.streetName,
                        houseNumber: user.defaultShippingAddress.houseNumber,
                        houseNumberAdd: user.defaultShippingAddress.houseNumberAdd,
                        postalCode: user.defaultShippingAddress.postalCode,
                        firstName: user.defaultShippingAddress.firstName,
                        lastName: user.defaultShippingAddress.lastName,
                        mobileNumber: user.defaultShippingAddress.mobileNumber
                    },
                    billingAddress: {
                        city: user.defaultBillingAddress.city,
                        province: user.defaultBillingAddress.province,
                        country: user.defaultBillingAddress.country,
                        streetName: user.defaultBillingAddress.streetName,
                        houseNumber: user.defaultBillingAddress.houseNumber,
                        houseNumberAdd: user.defaultBillingAddress.houseNumberAdd,
                        postalCode: user.defaultBillingAddress.postalCode,
                        firstName: user.defaultBillingAddress.firstName,
                        lastName: user.defaultBillingAddress.lastName,
                        mobileNumber: user.defaultBillingAddress.mobileNumber
                    }
                }
                logger.info(`get user addresses request has returned data ${user.email}`)
                return res.status(200).json(addressData);
            } else {
                logger.info(`get user addresses request has not returned data`);
                return res.status(204).json({
                    status: res.status,
                    message: 'no user'
                });
            }
        })
        .catch(next);
    }

}

module.exports = getUserAddresses;