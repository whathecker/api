const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

function isAdminAuth (req, res, next) {

    const cookies = req.headers.cookie;

    if (!cookies) {
        logger.warn(`adminUser is unauthenticated, request is rejected | no cookies in request`);
        return res.status(401).json({
            status: 'unauthenticated',
            message: 'no token'
        });
    }
   
    if (cookies) {
        const splitedCookies = cookies.split('; ');
        let token;
        const tokenSecret = 'secret';

        for (let i = 0; i < splitedCookies.length; i++) {
            const cookieName = splitedCookies[i].split('=')[0];
            if (cookieName === 'jwt') {
                token = splitedCookies[i].split('=')[1];
                break;
            } 
        }

        jwt.verify(token, tokenSecret, (err, decoded) => {
            if (err) {
                console.log(err);
                return res.status(401).json({
                    status: 'unauthenticated',
                    message: 'invalid or expired token'
                });

            } else {
                console.log(decoded);
                if (decoded.expires < Date.now()) {
                    return res.status(401).json({
                        status: 'unauthenticated',
                        message: 'invalid or expired token'
                    });
                }
                if (!decoded.user_id || decoded.userType !== 'admin') {
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