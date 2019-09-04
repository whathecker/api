const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookies = require('cookie-parser');
const connector = require('./utils/connector');
const morgan = require('morgan');
const cors = require('cors');
const dbString = connector.getDBString();
const helmet = require('helmet');
const app = express();

// load env variables
require('dotenv').config();

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

const isLocal = process.env.NODE_ENV === "local";
const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";


const corsOptions = {
    origin: [
        'http://localhost:3000', 
        'http://localhost:9231',
        'https://test.hellochokchok.com', 
        'https://backoffice.hellochokchok.com',
        'https://www.hellochokchok.com' 
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
}

app.use(helmet());
app.use(morgan('dev'));
app.use(cors(corsOptions));
(isDevelopment || isProduction)? app.set('trust proxy', 1): null;
app.use(cookies());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({
    verify: (req, res, buf) =>{
        const url = req.originalUrl;
        if (url.startsWith('/checkout/payment/hook')) {
            req.rawBody = buf.toString();
        }
    }
}));


// MQ receivers
require('./utils/messageQueue/queue-receivers'); /** adyen notification receivers */
require('./utils/messageQueue/mailQueue-receivers');
require('./utils/messageQueue/inventoryQueue-receivers');
require('./utils/messageQueue/orderQueue-receivers');
require('./utils/messageQueue/recurringQueue-receivers');
require('./utils/messageQueue/stripeQueue-receivers');

// mount routes
app.use(require('./routes'));

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



