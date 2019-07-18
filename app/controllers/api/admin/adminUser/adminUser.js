const router = require('express').Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const jwt = require('jsonwebtoken');

const logger = require('../../../../utils/logger');
const AdminUser = require('../../../../models/AdminUser');
const apiAuth = require('../../../../middlewares/verifyApikey');
const createAdminUser = require('../../../../helpers/admin/adminUser/createAdminUser');

const isLocal = process.env.NODE_ENV === "local";
const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

router.use(apiAuth);
router.use(passport.initialize());

passport.use('admin-local', new LocalStrategy({ 
    usernameField: 'email', 
    passwordField: 'password'}, 
    async (email, password, done) => {

        try {
            const adminUser = await AdminUser.findOne({ email: email }).exec();
            const passwordMatch = adminUser.validatePassword(adminUser, password);

            if (passwordMatch) {
                return done(null, adminUser);
            } else {
                return done('Incorrect email or password');
            }

        } catch (error) {
            done(error);
        }

}));

passport.use(new JWTStrategy({
    jwtFromRequest: req => req.cookies.jwt,
    secretOrKey: 'secret'
    }, (jwtPayload, done) => {
        if (Date.now() > jwtPayload.expires) {
            return done('jwt expired');
        }

        return done(null, jwtPayload);
    }
));

router.post('/user/login', (req, res, next) => {
    passport.authenticate('admin-local', 
    { session: false },
    (err, user) => {

        if (err) { 
            return next(err) 
        }
        if (!user) {
            return res.status(400).end();
        }

        // jwtPayload
        const payload = {
            user_id: user._id,
            userType: 'admin',
            expires: Date.now() + 60000
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
                    secure: false
                }
            } 

            if (isDevelopment || isProduction) {
                cookieOption = {
                    httpOnly: false,
                    sameSite: false,
                    secure: true,
                    domain: './hellochokchok.com',
                }
            }

            res.cookie('jwt', token, cookieOption); 
                
            return res.status(200).end();
        });
    })(req, res, next);
})

router.post('/user', createAdminUser);

module.exports = router;