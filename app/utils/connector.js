const dbConfig = require('../config/database');
//const mongoose = require('mongoose');

let connector = {};


connector.getDBString = () => {
    const envVar = process.env.NODE_ENV;

    if (!envVar) throw new Error('setup envVar before launching app: DB connetion failed');

    if (envVar === "development" || envVar === "local") {
        return `mongodb://${dbConfig.dev.username}:${dbConfig.dev.password}@cluster0-shard-00-00-jcvrs.mongodb.net:27017,cluster0-shard-00-01-jcvrs.mongodb.net:27017,cluster0-shard-00-02-jcvrs.mongodb.net:27017/chokchok?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`
        //return `mongodb+srv://chokchok_admin:InRP9wl35foO20fs@cluster0-jcvrs.mongodb.net/test?retryWrites=true&w=majority`
        //return `mongodb://${dbConfig.development.username}:${dbConfig.development.password}@${dbConfig.development.host}:${dbConfig.development.port}/${dbConfig.development.databaseName}`;
    }

    if (envVar === "production") {
        return `mongodb://${dbConfig.production.username}:${dbConfig.production.password}@${dbConfig.production.host}:${dbConfig.production.port}/${dbConfig.production.databaseName}`;
    }

    return;
}

module.exports = connector;