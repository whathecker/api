const AdminUser = require('../../../models/AdminUser');
const logger = require('../../../utils/logger');
const crypto = require('crypto');

function createAdminUser (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    
    if (!email || !password) {
        logger.error(`createAdminUser request has failed | parameter missing`);
        return res.status(400).json({
            status: 'failed',
            message: 'bad request'
        });
    }

    const emailDomain = email.split('@')[1];

    if (emailDomain !== "hellochokchok.com") {
        logger.info(`createAdminUser request has rejected | please use company email domain`);
        return res.status(200).json({
            status: 'failed',
            result: 'invalid_email',
            message: 'invalid email address is used'
        });
    }

    if (emailDomain === "hellochokchok.com") {

        AdminUser.findOne({ email: email })
        .then((user) => {
            if (!user) {
                // create admin
            
                const newAdmin = new AdminUser();
                newAdmin.email = email;
                newAdmin.salt = crypto.randomBytes(64).toString('hex');
                newAdmin.hash = newAdmin.setPassword(newAdmin, password);
                newAdmin.userId = newAdmin.setAdminUserId();
                newAdmin.adminApprovalRequired = false;
                newAdmin.save().then(()=>{
                    logger.info(`createAdminUser request has processed | ${email}`);
                    return res.status(201).json({
                        status: 'success',
                        result: 'processed',
                        message: 'admin signup request has processed'
                    });
                }).catch(next);
                    
            }

            if (user) {
                logger.warn(`createAdminUser request has not processed | duplicated email | ${email}`);
                return res.status(200).json({
                    status: 'failed',
                    result: 'duplicated_email',
                    message: 'duplicated email address is used'
                });
            }
        }).catch(next);

    }


}

module.exports = createAdminUser;