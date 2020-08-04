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

subscription.getSubscriptionById = async (req, res , next) => {
    const subscriptionId = req.params.id;
    try {
        const subscription = await subscriptionDB.findSubscriptionBySubscriptionId(subscriptionId);

        logger.info(`getSubscriptionById request is processed | ${subscriptionId.subscriptionId}`);
        return res.status(200).json(subscription);
    } catch (exception) {
        if (exception.status === "fail") {
            logger.warn(`getSubscriptionById request is failed | unknonw subscriptionId`);
            return res.status(422).json({
                status: "fail",
                message: exception.reason
            });
        }
        next(exception);
    }
};

module.exports = subscription;