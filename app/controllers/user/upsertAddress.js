const User = require('../../models/User');
const Address = require('../../models/Address');
const loggeer = require('../../utils/logger');

function upsertAddress (req, res, next) {
    //console.log(req.body);
    const address_id = req.body.id;

    if (!req.body.firstName 
        || !req.body.lastName
        || !req.body.postalCode
        || !req.body.houseNumber
        || !req.body.streetName
        || !req.body.city
        || !req.body.country ) {
        return res.status(400).json({
            status: res.status,
            message: 'invalid or missing parameter'
        });
    }

    User.findById(req.user._id).then((user) => {

        if (!address_id) {
            let address = new Address();
            address.firstName = req.body.firstName;
            address.lastName =  req.body.lastName;
            address.mobileNumber = req.body.mobileNumber;
            address.postalCode = req.body.postalCode;
            address.houseNumber = req.body.houseNumber;
            address.houseNumberAdd = req.body.houseNumberAdd;
            address.streetName = req.body.streetName;
            address.city = req.body.city;
            address.province = req.body.province;
            address.country = req.body.country;
            address.user = req.user._id;

            user.addresses.push(address);
            user.lastModified = Date.now();
            user.markModified('addresses');
            user.markModified('lastModified');
            
            Promise.all([
                user.save(),
                address.save()
            ]).then((values) => {
                if (values) {
                    loggeer.info(`upsertAddress request has created new address ${address._id}`);
                    return res.status(201).json({
                        status: res.status,
                        message: 'new address has created'
                    });
                }
            }).catch(next);
        }

        if (address_id) {

            const options = { new: true };
            const updates = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                mobileNumber: req.body.mobileNumber,
                postalCode: req.body.postalCode,
                houseNumber: req.body.houseNumber,
                houseNumberAdd: req.body.houseNumberAdd,
                streetName: req.body.streetName,
                city: req.body.city,
                province: req.body.province,
                country: req.body.country,
                lastModified: Date.now()
            }

            Address.findByIdAndUpdate(address_id, updates, options)
            .then((address) => {
                if (address) {
                    user.lastModified = Date.now();
                    user.markModified('lastModified');
                    user.save();
                    loggeer.info(`upsertAddress request has updated existing address ${address_id}`)
                    return res.status(200).json({
                        status: res.status,
                        message: 'address has updated'
                    });
                } else {
                    loggeer.info(`upsertAddress request did not found address ${address_id}`);
                    return res.status(204).json({
                        status: res.status,
                        message: 'no address'
                    });
                }
            }).catch(next);
        }

    }).catch(next);
    
}

module.exports = upsertAddress;