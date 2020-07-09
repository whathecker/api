const consumers = {
    mail: require('./mail'),
    order: require('./order')
};

const mountConsumers = () => {
    for (let prop of Object.keys(consumers)) {
        consumers[prop].enableConsumer();
    }
};

module.exports = {
    mountConsumers
};