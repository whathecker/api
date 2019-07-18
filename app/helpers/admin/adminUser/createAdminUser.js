const AdminUser = require('../../../models/AdminUser');
const logger = require('../../../utils/logger');
const crypto = require('crypto');

function createAdminUser (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    
    if (!email || !password) {
        return res.status(400).json({
            status: 'failed',
            message: 'bad request'
        });
    }

    const emailDomain = email.split('@')[1];

    if (emailDomain !== "hellochokchok.com") {
        return res.status(200).json({
            status: 'failed',
            result: 'invalid_email',
            message: 'invalid email address is used'
        });
    }

    if (emailDomain === "hellochokchok.com") {

        AdminUser.findOne({ email: email})
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
                    return res.status(201).json({
                        status: 'success',
                        result: 'processed',
                        message: 'admin signup request has processed'
                    });
                }).catch(next);
            }

            if (user) {
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