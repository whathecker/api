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
    app = express();
    //Order = require('./models/Order');

//console.log(Order.prototype.createOrderNumber('development', 'germany'));


mongoose.connect(dbString, (err) => {
    if (err) throw err;
    console.log(`successfully connected to database`);
}); 

const isProduction = process.env.NODE_ENV === "production";

const corsOptions = {
    origin: ['http://localhost:3000', 'https://test.hellochokchok.com', 'https://www.hellochokchok.com' ],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    credentials: true,

}

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(session({ 
    cookie: {
      maxAge: 600000,
      // TODO: update secure to true with dynamic envVar check 
      secure: true,
      sameSite: false,
      httpOnly: false
    },
    secret: "secret",
    saveUninitialized: true,
    resave: true,
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



