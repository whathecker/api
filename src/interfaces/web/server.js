const serverStarter = require('./serverStarter');

require('./consumerStarter');

const env = process.env.NODE_ENV;

(env === "development" || env === "production")? 
    serverStarter.runAppBehindProxy() : null;

serverStarter.loadMiddlewares();
serverStarter.runServer(); 


