const open = require('amqplib');
const mqConnection = require('../connection');

const createReceiverConnection = async () => {
    try {
        const connection  = await open.connect(mqConnection);
        return Promise.resolve(connection);
    } catch (err) {
        return Promise.reject(err);
    }
}

module.exports = {
    createReceiverConnection
};