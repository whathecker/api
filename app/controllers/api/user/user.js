const router = require('express').Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const User = require('../../../models/User');
const logger = require('../../../utils/logger');
const userAuth = require('../../../middlewares/auth');

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
passport.use( new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => {
    
    User.findOne({ email: email }, (err, user)=> {
        if (err) { 
            logger.error('error happened while login');
            return done(err); 
        }

        if (!user || !user.validatePassword(user, password)) {
            logger.info('login validation failed, wrong email or password');
            return done(null, false);
        }
        logger.info('login success');
        return done(null, user);
    }); 
}
)); 


router.post('/user/login', (req, res, next) => {

    passport.authenticate('local',  (err, user, info) => {
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
    res.status(200).json({ message: "user session has terminated" });
});


router.post('/user', (req, res, next) => {

    User.findOne({ email: req.body.email }).then((user) => {
        if (user) {
            logger.info('sign-up rejected due to duplicated email address');
            return res.status(202).json({ message : "duplicated email address"});
        } else {
            const user = new User();
            user.email = req.body.email;
            user.salt = crypto.randomBytes(64).toString('hex');
            user.hash = user.setPassword(user, req.body.password);
            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;

            user.save().then((user) =>{
                logger.info('new user account has created');
                return res.status(201).send(user);
            }).catch(next);
        }

    }).catch(next);

});


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

// endpoint to check if email is associated with account or not
router.get('/user/email',  (req, res, next) => {
    // find if account exist with email address
    if (req.body.email) {
        User.findOne({ email: req.body.email })
            .then((user) => {
                if (!user) {
                    logger.warn('request was okay, but no user has found');
                    return res.status(204).json({ message: 'cannot find user' });
                }
                logger.info('request has succeed');
                return res.status(200).json({ message: 'email being used' });
            }).catch(next);
    } else {
        return res.status(400).json({ message: 'bad request' });
    } 
});



module.exports = router;