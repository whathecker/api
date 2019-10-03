const router = require('express').Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const Mongostore = require('connect-mongo')(session);
const connector = require('../../../utils/connector');
const dbString = connector.getDBString();

//const crypto = require('crypto');
const User = require('../../../models/User');
const logger = require('../../../utils/logger');
const userAuth = require('../../../middlewares/auth');

const getUserSubscription = require('../../../controllers/user/getUserSubscription');
const getUserDetail = require('../../../controllers/user/getUserDetail');
const getUserAddresses = require('../../../controllers/user/getUserAddresses');
const deleteAddress = require('../../../controllers/user/deleteAddress');
const createUser = require('../../../controllers/user/createUser');
const upsertAddress = require('../../../controllers/user/upsertAddress');
const updateContactDetail = require('../../../controllers/user/updateContactDetail');
const updateEmailAddress = require('../../../controllers/user/updateEmailAddress');
const updatePassword = require('../../../controllers/user/updatePassword');
const resetPassword = require('../../../controllers/user/resetPassword');
const getResetPasswordToken = require('../../../controllers/user/getResetPasswordToken');
const getUserOrders = require('../../../controllers/user/getUserOrders');
const getUserInvoice = require('../../../controllers/user/getUserInvoice');
const createSetupIntent = require('../../../controllers/user/createSetupIntent');
//const getUserBillings = require('../../../helpers/user/getUserBillings');
const getUserBillingsStripe = require('../../../controllers/user/getUserBillingsStripe');
//const addUserBilling = require('../../../helpers/user/addUserBilling');
const addUserBillingStripe = require('../../../controllers/user/addUserBillingStripe');
const addRedirectedBilling = require('../../../controllers/user/addRedirectedBilling');
const updateDefaultBilling = require('../../../controllers/user/updateDefaultBilling');
//const removeUserBilling = require('../../../controllers/user/removeUserBilling');
const removeUserBillingStripe = require('../../../controllers/user/removeUserBillingStripe');
const updatePackage = require('../../../controllers/user/updatePackage');
const apiAuth = require('../../../middlewares/verifyApikey');

const isTest = process.env.NODE_ENV === "test";
const isLocal = process.env.NODE_ENV === "local";
const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";


router.use(apiAuth);

if (isLocal || isTest) {
    router.use(session({ 
        cookie: {
          maxAge: 600000,
          secure: false,
          sameSite: false,
          httpOnly: false
        },
        name: 'chokchok_session',
        secret: "secret",
        saveUninitialized: false,
        resave: true,
        rolling: true,
        store: new Mongostore({ url: dbString })
    }));
} else if (isDevelopment || isProduction) {
    router.use(session({ 
        cookie: {
          maxAge: 172800000, // 48hr duration 
          secure: true,
          sameSite: false,
          httpOnly: false,
          domain: '.hellochokchok.com'
        },
        name: 'chokchok_session',
        secret: process.env.USER_AUTH_COOKIE_SECRET_PROD,
        saveUninitialized: false,
        resave: true,
        rolling: true,
        store: new Mongostore({ url: dbString })
    }));
}   

router.use(passport.initialize());
router.use(passport.session());

// serialize & deserialize authenticated user
passport.serializeUser((user, done) =>{
    console.log('serailized user');
    done(null, user.id);
});
  
passport.deserializeUser((id, done) => {
    console.log('deserialized user')
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// configure passport local strategy
passport.use('user-local', new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => {
    
    User.findOne({ email: email }, (err, user)=> {
        if (err) { 
            logger.error('error happened while login');
            return done(err); 
        }

        if (!user || !user.validatePassword(user, password)) {
            logger.info('login validation failed, wrong email or password');
            return done(null, false);
        }

        if (user && user.validatePassword(user, password)) {
            
            user.lastLogin = Date.now();
            user.markModified('lastLogin');
            user.save();
            logger.info(`login success ${user.email}`);
            return done(null, user);
            
        }
        
    }); 
})); 


router.post('/user/login', (req, res, next) => {

    passport.authenticate('user-local',  (err, user, info) => {
        if (err) { return next(err) }
        if (!user) { return res.status(400).end(); }

        req.logIn(user, (err) => {
            if (err) { return next(err); }
            return res.status(200).send(user);
        });

    })(req, res, next);
});

router.get('/user/logout', userAuth, (req, res, next) => {

    req.logout();
    req.session.destroy();
    if (isLocal || isTest) {
        res.clearCookie('chokchok_session');
    }
    if (isDevelopment || isProduction) {
        res.clearCookie('chokchok_session', { domain: '.hellochokchok.com', path: '/' });
    }
    
    return res.status(200).json({ message: "user session has terminated" });
    
});

router.get('/user', userAuth, getUserDetail);
router.get('/user/addresses', userAuth, getUserAddresses);
router.put('/user/addresses/address', userAuth, upsertAddress);
router.delete('/user/addresses/address/:id', userAuth, deleteAddress);
router.put('/user/contact', userAuth, updateContactDetail);
router.put('/user/email', userAuth, updateEmailAddress);
router.put('/user/password', userAuth, updatePassword);
router.put('/user/password/reset', resetPassword);
router.get('/user/password/reset/:token', getResetPasswordToken);
router.get('/user/orders', userAuth, getUserOrders);
router.get('/user/orders/order/:orderNumber/invoice', userAuth, getUserInvoice);
router.get('/user/billings', userAuth, getUserBillingsStripe);
router.post('/user/billings/payment/session', userAuth, createSetupIntent);
router.post('/user/billings/payment', userAuth, addUserBillingStripe);
router.post('/user/billings/payment/details', userAuth, addRedirectedBilling);
router.put('/user/billings/payment/default', userAuth, updateDefaultBilling);
router.delete('/user/billings/payment/:billingId', userAuth, removeUserBillingStripe);
router.get('/user/subscription', userAuth, getUserSubscription);
router.put('/user/subscription/package', userAuth, updatePackage);
router.post('/user', createUser);


// to add admin protection for this endpoint
router.delete('/user', (req, res, next) => {

    if (!req.body.email) {
        logger.warn('user delete request has rejected as email param is missing');
        return res.status(400).json({ message: 'bad request' });
    }

    User.findOneAndRemove({ email: req.body.email })
        .then((user) => {
            if (!user) { 
                logger.warn('user delete request has rejected as email is unknown')
                return res.status(204).json({ message: 'can not find user'}); 
            }
            logger.info('user delete request has succeed');
            return res.status(200).json({ message: 'success' });
        }).catch(next);
});

module.exports = router;