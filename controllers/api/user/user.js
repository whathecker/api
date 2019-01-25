const router = require('express').Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const User = require('../../../models/User');


// configure passport local strategy
passport.use( new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => {
    
    User.findOne({ email: email }, (err, user)=> {
        if (err) { return done(err); }

        if (!user || !user.validatePassword(user, password)) {
            return done(null, false);
        }
        return done(null, user);
    }); 
}
)); 

// serialize & deserialize authenticated user
passport.serializeUser((user, done) =>{
    done(null, user.id);
});
  
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

router.post('/user/login', (req, res, next) => {

    passport.authenticate('local',  (err, user, info) => {
        if (err) { return next(err) }
        if (!user) { return res.status(401).end(); }

        req.logIn(user, (err) => {
            if (err) { return next(err); }
            return res.status(200).send(user);
        });

    })(req, res, next);
});


// public endpoint /api/user
// create new user
// params : email, password, firstname, lastname 

router.post('/user', (req, res, next) => {

    User.findOne({ email: req.body.email }).then((user) => {

        if (user) {
            res.status(202).json({ "message" : "duplicated email address"});
        } else {
            const user = new User();
            user.email = req.body.email;
            user.salt = crypto.randomBytes(64).toString('hex');
            user.hash = user.setPassword(user, req.body.password);
            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;

            user.save().then((user) =>{
                res.status(201).send(user);
            }).catch(next);
        }

    }).catch(next);

});


module.exports = router;