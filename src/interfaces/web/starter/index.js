const dependencies = {
    serverFramework: require('express'),
    bodyParserLoader: require('./bodyparser-loader'),
    cookieParser: require('cookie-parser'),
    crossOriginHandler: require('./cors-handler'),
    httpLogger: require('morgan'),
    securityEnhancer: require('helmet')
};

class ServerStarter {
    constructor ({
        serverFramework,
        bodyParserLoader,
        cookieParser,
        crossOriginHandler,
        httpLogger,
        securityEnhancer
    } = {}) {
        this.app = serverFramework();
        this.bodyParserLoader = bodyParserLoader;
        this.cookieParser = cookieParser,
        this.crossOriginHandler = crossOriginHandler;
        this.httpLogger = httpLogger;
        this.securityEnhancer = securityEnhancer
    }

    runAppBehindProxy () {
        this.app.set('trust proxy', true);
    }

    loadMiddlewares () {
        this.loadSecurityEnhancer();
        this.loadHttpLogger();
        this.loadCors();
        this.loadCookieParser();
        this.loadBodyParser();
        //this.mountApiRoutes();
        this.load404Checker();
        this.loadErrorHandler();
    }

    mountApiRoutes () {

    }

    loadSecurityEnhancer () {
        this.app.use(this.securityEnhancer());
    }

    loadHttpLogger () {
        this.app.use(this.httpLogger('dev'));
    }

    loadCors () {
        this.app.use(this.crossOriginHandler.enableCors());
    }

    loadCookieParser () {
        this.app.use(this.cookieParser());
    }

    loadBodyParser () {
        this.app.use(this.bodyParserLoader.enableParseOfUrlEncodedReqBody());
        this.app.use((req, res, buf) => this.bodyParserLoader.enableParseOfJsonReqBody(req, res, buf));
    }

    load404Checker () {
        this.app.use((req, res, next) => {
            const err = new Error('not found');
            err.status = 404;
            next(err);
        });
    }

    loadErrorHandler () {
        const envVar = process.env.NODE_ENV;

        if (envVar === "production") {
            this.app.use(this.handlerProdError);
        } else {
            this.app.use(this.handleDevError)
        }
    }

    handleDevError (err, req, res, next) {
        console.error(err.stack);
        res.status(err.status || 500);
        res.json({errors: {
            message: err.message,
            error: err
        }});
    }

    handlerProdError (err, req, res, next) {
        res.status(err.status || 500);
        res.json({errors: {
            message: err.message,
            error: err
        }});
    }

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

