const subscriptionDB = require('../../../../../../../infra/data-access/subscription-db');
const logger = require('../../../../../../_shared/logger');

let subscription = {};

subscription.listSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await subscriptionDB.listSubscriptions();
        logger.info(`listSubscriptions endpoint has processed and returned subscriptions`);
        return res.status(200).json({
            status: "success",
            subscriptions: subscriptions
        });
    } catch (exception) {
        next(exception);
    }
};

module.exports = subscription;