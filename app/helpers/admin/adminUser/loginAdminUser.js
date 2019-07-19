const passport = require('passport');
const jwt = require('jsonwebtoken');
const logger = require('../../../utils/logger');

const isLocal = process.env.NODE_ENV === "local";
const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";


function loginAdminUser (req, res, next) {
    passport.authenticate('admin-local', { session: false }, (error, user) => {
        if (error) {
            return next(error);
        }
        if (!user) {
            logger.warn(`loginAdminUser request has not processed | wrong login detail`);
            return res.status(401).json({
                status: "failed",
                message: "wrong credentials"
            });
        }

        // jwtPayload
        const payload = {
            user_id: user._id,
            userType: 'admin',
            expires: Date.now() + 7200000
        };

        req.logIn(payload, {session: false}, (err) => {
            if (err) { 
                return next(err) 
            };
        
            const token = jwt.sign(JSON.stringify(payload), 'secret');

            let cookieOption;

            if (isLocal) {
                cookieOption = {
                    httpOnly: false,
                    sameSite: false,
                    secure: false,
                    maxAge: 7200000
                }
            } 

            if (isDevelopment || isProduction) {
                cookieOption = {
                    httpOnly: false,
                    sameSite: false,
                    secure: true,
                    domain: './hellochokchok.com',
                    maxAge: 7200000
                }
            }

            res.cookie('jwt', token, cookieOption); 
            logger.info(`loginAdminUser request has processed | ${user._id}`);    
            return res.status(200).end();
        });
        
    })(req, res, next);
}

module.exports = loginAdminUser;