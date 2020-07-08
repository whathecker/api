const serverStarter = require('./starter');
const mqConsumers = require('./mqConsumers');

const env = process.env.NODE_ENV;

mqConsumers.mountConsumers();

(env === "development" || env === "production")? 
    serverStarter.runAppBehindProxy() : null;

serverStarter.loadMiddlewares();
serverStarter.runServer(); 


