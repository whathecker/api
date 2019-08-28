const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

let secret;
const env = process.env.NODE_ENV;
if (env === 'test' || env === 'local' || env === 'development') {
    secret = process.env.ADMIN_AUTH_SECRET_TEST;
}

if (env === 'production') {
    secret = process.env.ADMIN_AUTH_SECRET_PROD;
}

function isAdminAuth (req, res, next) {

    //const cookies = req.headers.cookie;
    //console.log(cookies);
    //console.log(req.headers);
    //console.log(req.cookies);
    //console.log(req);
    const cookie = req.cookies.jwt;

    if (!cookie) {
        logger.warn(`adminUser is unauthenticated, request is rejected | no cookies in request`);
        return res.status(401).json({
            status: 'unauthenticated',
            message: 'no token'
        });
    }
   
    if (cookie) {
        //const splitedCookies = cookies.split('; ');
        //let token;
        const tokenSecret = secret;
        const token = cookie;
        /* 
        for (let i = 0; i < splitedCookies.length; i++) {
            const cookieName = splitedCookies[i].split('=')[0];
            if (cookieName === 'jwt') {
                token = splitedCookies[i].split('=')[1];
                break;
            } 
        } */

        jwt.verify(token, tokenSecret, (err, decoded) => {
            if (err) {
                console.log(err);
                logger.warn(`adminUser is unauthenticated, request is rejected | unknown error`);
                return res.status(401).json({
                    status: 'unauthenticated',
                    message: 'invalid or expired token'
                });

            } else {
                //console.log(decoded);
                if (decoded.expires < Date.now()) {
                    logger.warn(`adminUser is unauthenticated, request is rejected | expired token`);
                    return res.status(401).json({
                        status: 'unauthenticated',
                        message: 'invalid or expired token'
                    });
                }
                if (!decoded.user_id || decoded.userType !== 'admin') {
                    logger.warn(`adminUser is unauthenticated, request is rejected | invalid token`);
                    return res.status(401).json({
                        status: 'unauthenticated',
                        message: 'invalid or expired token'
                    });
                }
                next();
            }
        });
  
    }
}

module.exports = isAdminAuth;