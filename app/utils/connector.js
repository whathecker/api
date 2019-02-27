const dbConfig = require('../config/database');
//const mongoose = require('mongoose');

let connector = {};


connector.getDBString = () => {
    const envVar = process.env.NODE_ENV;

    if (!envVar) throw new Error('setup envVar before launching app: DB connetion failed');

    if (envVar === "development" || envVar === "local") {
        return `mongodb://${dbConfig.development.username}:${dbConfig.development.password}@${dbConfig.development.host}:${dbConfig.development.port}/${dbConfig.development.databaseName}`;
    }

    if (envVar === "production") {
        return `mongodb://${dbConfig.production.username}:${dbConfig.production.password}@${dbConfig.production.host}:${dbConfig.production.port}/${dbConfig.production.databaseName}`;
    }

    return;
}

module.exports = connector;