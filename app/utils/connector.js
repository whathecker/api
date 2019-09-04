const dbConfig = require('../config/database');
//const mongoose = require('mongoose');

let connector = {};


connector.getDBString = () => {
    const envVar = process.env.NODE_ENV;

    if (!envVar) throw new Error('setup envVar before launching app: DB connetion failed');

    if (envVar === 'test') {
        return `mongodb://${dbConfig.test.username}:${dbConfig.test.password}@cluster0-shard-00-00-dkwbe.mongodb.net:27017,cluster0-shard-00-01-dkwbe.mongodb.net:27017,cluster0-shard-00-02-dkwbe.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`
    }
    
    if (envVar === "development" || envVar === "local") {
        return `mongodb://${dbConfig.dev.username}:${dbConfig.dev.password}@cluster0-shard-00-00-jcvrs.mongodb.net:27017,cluster0-shard-00-01-jcvrs.mongodb.net:27017,cluster0-shard-00-02-jcvrs.mongodb.net:27017/chokchok?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`
    }

    if (envVar === "production") {
        return `mongodb://chokchok_prod:${dbConfig.prod.password}@prod-shard-00-00-iltlw.mongodb.net:27017,prod-shard-00-01-iltlw.mongodb.net:27017,prod-shard-00-02-iltlw.mongodb.net:27017/test?ssl=true&replicaSet=Prod-shard-0&authSource=admin&retryWrites=true&w=majority`;
    }

    return;
}

module.exports = connector;