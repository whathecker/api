module.exports = {
    mail: {
        queue: 'mail',
        retryQueue: 'mail-retry',
        exchange: 'mail',
        retryExchange: 'mail-retry'
    },
    order: {
        queue: 'order',
        retryQueue: 'order-retry',
        exchange: 'order',
        retryExchange: 'order-retry'
    },
    stripe: {
        queue: 'stripe',
        retryQueue: 'stripe-retry',
        exchange: 'stripe',
        retryExchange: 'stripe-retry'
    }
};