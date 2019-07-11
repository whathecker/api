const User = require('../../models/User');
const Address = require('../../models/Address');
const logger = require('../../utils/logger');

function deleteAddress (req, res, next) {
    // find user
    // see if default shipping or billing address is the address requested
    // reject the request if above is matched
    // if address isn't default shipping or billing address
    // delete the address from User model
    // and delete the address schema itself 
    console.log(req.params.id);
    const address_id = req.params.id;

    User.findById(req.user._id).then((user) => {

        if (user.defaultShippingAddress._id.equals(address_id)||
            user.defaultBillingAddress._id.equals(address_id)) {
            return res.status(422).json({
                status: res.status,
                message: 'cannot delete shipping or billing address'
            });
        }

        user.addresses.pull(address_id);
        user.lastModified = Date.now();
        user.markModified('addresses');
        user.markModified('lastModified');
        Promise.all([
            Address.findByIdAndRemove(address_id),
            user.save()
        ]).then((values) => {
            if (values) {
                return res.status(200).json({
                    status: res.status,
                    message: 'address has deleted'
                });
            }
        }).catch(next);
    }).catch(next);
}

module.exports = deleteAddress;