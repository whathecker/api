const express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    connector = require('./utils/connector'),
    morgan = require('morgan'),
    cors = require('cors'),
    dbString = connector.getDBString(),
    helmet = require('helmet'),
    app = express();

const dbOptions = {
    connectTimeoutMS: 30000, // Give up initial connection after 30 seconds
    keepAlive: 300000,
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
}

mongoose.connect(dbString, dbOptions, (err) => {
    if (err) throw err;
    console.log(`successfully connected to database`);
}); 

const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

const corsOptions = {
    origin: [
        'http://localhost:3000', 
        'http://localhost:9000',
        'https://test.hellochokchok.com', 
        'https://www.hellochokchok.com' 
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
}

app.use(helmet());
app.use(morgan('dev'));
app.use(cors(corsOptions));
(isDevelopment || isProduction)? app.set('trust proxy', 1): null;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// message receiver for adyen notification
require('./utils/messageQueue/queue-receivers');
// message receiver for transactional email
require('./utils/messageQueue/mailQueue-receivers');

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



