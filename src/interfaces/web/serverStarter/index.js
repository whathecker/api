const dependencies = {
    serverFramework: require('express'),
    bodyParser: require('body-parser'),
    cookieParser: require('cookie-parser'),
    crossOriginHandler: require('cors'),
    httpLogger: require('morgan'),
    securityEnhancer: require('helmet'),
    apiRoutesLoader: require('./routes')
};

class ServerStarter {
    constructor ({
        serverFramework,
        bodyParser,
        cookieParser,
        crossOriginHandler,
        httpLogger,
        securityEnhancer,
        apiRoutesLoader
    } = {}) {
        this.app = serverFramework();
        this.apiRoutes = apiRoutesLoader(serverFramework.Router());
        this.bodyParser = bodyParser;
        this.cookieParser = cookieParser,
        this.crossOriginHandler = crossOriginHandler;
        this.httpLogger = httpLogger;
        this.securityEnhancer = securityEnhancer;
    }
    
    runAppBehindProxy () {
        this.app.set('trust proxy', true);
    } 

    loadMiddlewares () {
        this.loadSecurityEnhancer();
        this.loadHttpLogger();
        this.loadCors();
        this.loadCookieParser();
        this.loadUrlEncodeReqBodyParser();
        this.loadJsonReqBodyParser();
        this.mountApiRoutes();
        this.load404Checker();
        this.loadErrorHandler();
    } 

    mountApiRoutes () {
        this.app.use(this.apiRoutes);
    };

    loadSecurityEnhancer () {
        this.app.use(this.securityEnhancer());
    };
    
    loadHttpLogger () {
        this.app.use(this.httpLogger('dev'));
    };
    
    loadCors () {
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
        };
        
        this.app.use(this.crossOriginHandler(corsOptions));
    };
    
    loadCookieParser () {
        this.app.use(this.cookieParser());
    };
    
    loadUrlEncodeReqBodyParser () {
        this.app.use(this.bodyParser.urlencoded({ extended: true }));  
    };

    loadJsonReqBodyParser () {
        this.app.use(this.bodyParser.json({
            verify: (req, res, buf) =>{
                const url = req.originalUrl;
                if (url.startsWith('/checkout/payment/hook')) {
                    req.rawBody = buf.toString();
                }
            }
        }));
    };

    load404Checker () {
        this.app.use((req, res, next) => {
            const err = new Error('not found');
            err.status = 404;
            next(err);
        });
    };

    loadErrorHandler () {
        const envVar = process.env.NODE_ENV;

        if (envVar === "production") {
            this.app.use(this.handlerProdError);
        } else {
            this.app.use(this.handleDevError)
        }
    };

    handleDevError (err, req, res, next) {
        console.error(err.stack);
        res.status(err.status || 500);
        res.json({errors: {
            message: err.message,
            error: err
        }});
    };

    handlerProdError (err, req, res, next) {
        res.status(err.status || 500);
        res.json({errors: {
            message: err.message,
            error: err
        }});
    };

    runServer () {
        this.app.listen(process.env.PORT, (err) => {
            if (err) throw err;
            console.log(`server is running on port number: ${process.env.PORT}`);
            console.log(`current env is : ${process.env.NODE_ENV}`);
            console.log(`current log level is : ${process.env.LOG_LEVEL}`);
        });
    };
}

module.exports = new ServerStarter(dependencies);

