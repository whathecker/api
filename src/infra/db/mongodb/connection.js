let config = require('../../../configuration');
let mongoose = require('mongoose');

// overwrite mongoose Promise to ES6 promise
mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);

const env = process.env.NODE_ENV;

const _getDbConnectionString = (env) => {

    if (!env) {
        throw new Error('Setup env variable before attempting to connect mongoDB');
    }
    
    if (env === "test") {
        const username = config.mongo.test.MONGO_USER;
        const pwd = config.mongo.test.MONGO_PWD;
        return `mongodb://${username}:${pwd}@cluster0-shard-00-00-dkwbe.mongodb.net:27017,cluster0-shard-00-01-dkwbe.mongodb.net:27017,cluster0-shard-00-02-dkwbe.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`
    }
    
    if (env === "development" || env === "local") {
        const username = config.mongo.dev.MONGO_USER;
        const pwd = config.mongo.dev.MONGO_PWD;
        return `mongodb://${username}:${pwd}@cluster0-shard-00-00-jcvrs.mongodb.net:27017,cluster0-shard-00-01-jcvrs.mongodb.net:27017,cluster0-shard-00-02-jcvrs.mongodb.net:27017/chokchok?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`
    }
    
    if (env === "production") {
        const username = config.mongo.prod.MONGO_USER;
        const pwd = config.mongo.prod.MONGO_PWD;
        return `mongodb://${username}:${pwd}@prod-shard-00-00-iltlw.mongodb.net:27017,prod-shard-00-01-iltlw.mongodb.net:27017,prod-shard-00-02-iltlw.mongodb.net:27017/chokchok?ssl=true&replicaSet=Prod-shard-0&authSource=admin&retryWrites=true&w=majority`;
    }
}

const dbOptions = {
    connectTimeoutMS: 30000, // Give up initial connection after 30 seconds
    keepAlive: 300000,
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
};

const dbString = _getDbConnectionString(env);

mongoose.connect(dbString);

mongoose.connection.once('open', ()=> {
    console.log('Connection to mongoDB has been made');
}).on('error', (err) => {
    console.log(`Unexpected error while connecting to mongoDB `, err);
}).on('disconnected', () => {
    console.log('Disconnected to mongoDB');
});

module.exports = mongoose;