const User = require('../../models/User');
const crypto = require('crypto');
const logger = require('../../utils/logger');

function createUser (req, res, next) {
    const payload = req.body;

    User.findOne({ email: payload.email }).then((user) => {
        if (user) {
            logger.info('sign-up rejected due to duplicated email address');
            return res.status(202).json({ message : "duplicated email address"});
        } else {
            const user = new User();

            for (const prop in payload) {

                if (prop === "email") {
                    user.email = payload.email;
                }
                if (prop === "password") {
                    user.salt = crypto.randomBytes(64).toString('hex');
                    user.hash = user.setPassword(user, payload.password);
                }
                if (prop === "firstname") {
                    user.firstname = payload.firstname;
                }
                if (prop === "lastname") {
                    user.lastname = payload.lastname;
                }
            }

            user.save().then((user) => {
                logger.info('new user account has created');
                return res.status(201).send(user);
            }).catch(next);

        }
    }).catch(next);
}


module.exports = createUser;