const express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    connector = require('./utils/connector'),
    session = require('express-session'),
    Mongostore = require('connect-mongo')(session),
    passport = require('passport'),
    morgan = require('morgan'),
    apiAuthentication = require('./middlewares/verifyApikey'),
    cors = require('cors'),
    dbString = connector.getDBString(),
    helmet = require('helmet'),
    app = express();
    //Order = require('./models/Order');

//console.log(Order.prototype.createOrderNumber('development', 'germany'));


mongoose.connect(dbString, (err) => {
    if (err) throw err;
    console.log(`successfully connected to database`);
}); 

//const isLocal = process.env.NODE_ENV === "local";
//const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

const corsOptions = {
    origin: ['http://localhost:3000', 'https://test.hellochokchok.com', 'https://www.hellochokchok.com' ],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
}

app.use(helmet());
app.use(morgan('dev'));
app.use(cors(corsOptions));
/*
if (isLocal) {
    app.use(session({ 
        cookie: {
          maxAge: 600000,
          secure: false,
          sameSite: false,
          httpOnly: false
        },
        name: 'session',
        secret: "secret",
        saveUninitialized: true,
        resave: true,
        rolling: true,
        store: new Mongostore({ url: dbString })
    }));
} else if (isDevelopment || isProduction) {
    app.set('trust proxy', 1);
    app.use(session({ 
        cookie: {
          maxAge: 172800000, // 48hr duration 
          secure: true,
          sameSite: false,
          httpOnly: false,
          domain: '.hellochokchok.com'
        },
        name: 'session',
        secret: "B!DP7d#8hU^wMT+S",
        saveUninitialized: true,
        resave: true,
        rolling: true,
        store: new Mongostore({ url: dbString })
    }));
} */

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
/*
app.use(passport.initialize());
app.use(passport.session()); */


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



