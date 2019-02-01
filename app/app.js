const express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    connector = require('./utils/connector'),
    session = require('express-session'),
    Mongostore = require('connect-mongo')(session),
    passport = require('passport'),
    morgan = require('morgan'),
    apiAuthentication = require('./middlewares/auth'),
    cors = require('cors'),
    dbString = connector.getDBString(),
    app = express();

// connect database
mongoose.connect(dbString, (err) => {
    if (err) throw err;
    console.log(`successfully connected to database`);
}); 

// configure application
const isProduction = process.env.NODE_ENV === "production";


// print morgan log to stderr stream

app.use(morgan('dev'));
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

module.exports = app; // for testing



