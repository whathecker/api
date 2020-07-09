const serverStarter = require('./starter');
const consumers = require('./consumers');

const env = process.env.NODE_ENV;

consumers.mountConsumers();

(env === "development" || env === "production")? 
    serverStarter.runAppBehindProxy() : null;

serverStarter.loadMiddlewares();
serverStarter.runServer(); 


