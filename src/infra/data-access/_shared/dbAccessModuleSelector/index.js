const config = require('../../../../configuration');

module.exports = () => {

    if (config.DB_SELECTION === "mongodb") {
        return "mongodb";
    }

    if (config.DB_SELECTION === "memory") {
        return "memory";
    }

    throw new Error('unknown config option at DB_SELECTION');
};