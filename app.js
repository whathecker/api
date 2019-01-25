const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const connector = require('./utils/connector');
const session = require('express-session');
const Mongostore = require('connect-mongo')(session);
const passport = require('passport');
const errorhandler = require('errorhandler');
const apiAuthentication = require('./middlewares/auth');
const cors = require('cors');
const dbString = connector.getDBString();
const app = express();


const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
    app.use(errorhandler());
}

// connect database
mongoose.connect(dbString, (err) => {
    if (err) throw err;
    console.log(`successfully connected to database`);
}); 


// configure application
app.use(cors());
app.use(session({ 
    cookie: {
      maxAge: 12000,
      secure: false
    },
    secret: "secret",
    saveUninitialized: false,
    resave: false,
    store: new Mongostore({ url: dbString })
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());


// api authentication
app.use(apiAuthentication);
// mount routes
app.use(require('./controllers'));
// 404 checker
app.use((req, res, next) => {
    const err = new Error('not found');
    err.status= 404;
    next(err);
});

// development error handler
if (!isProduction) {
    app.use((err, req, res, next) => {
        console.error(err.stack);

        res.status(err.status || 500);
        res.json({errors : {
            message: err.message,
            error : err
        }});
    });
}

// production error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({errors: {
        message: err.message,
        error: err
    }});
});


let port = process.env.PORT || 3001;

// listen to server
app.listen(port, () => {
    console.log('app is listening to: ' + port + ` on ${process.env.NODE_ENV}`);
});

module.exports = app; // for testing