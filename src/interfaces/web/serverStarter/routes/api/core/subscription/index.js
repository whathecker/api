const subscriptionDB = require('../../../../../../../infra/data-access/subscription-db');
const mqHelper = require('../../../../../../_shared/messageQueueHelper');
const queues = mqHelper.queues;
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

subscription.updateSubscriptionStatus = async (req, res, next) => {
    
    const subscriptionId = req.params.id;
    const isActive = req.body.isActive;

    if (isActive === null || isActive === undefined) {
        logger.warn(`updateSubscriptionStatus request has rejected as param is missing`);
        return res.status(400).json({
            status: "fail",
            message: "bad request"
        });
    }

    try {
        const updatedSubscription = await subscriptionDB.updateSubscriptionStatus(subscriptionId, isActive);

        const env = process.env.NODE_ENV;

        let event = {
            eventType: null,
            subscriptionId: updatedSubscription.subscriptionId
        };

        if (isActive === true) {
            event.eventType = "createOrder";
        }

        if (isActive === false) {
            event.eventType = "cancelOutstandingOrders";
        }

        if (env !== "test") {
            await mqHelper.publisher.publishMessage(queues.order, event);
            logger.info(`successfully dispatched event ${event.eventType} to order queue`);
        }

        return res.status(200).json({
            status: 'success',
            message: 'subscription status has updated'
        });

    } catch (exception) {
        if (exception.status === "fail") {
            logger.error(`updateSubscriptionStatus request has failed | reason: ${exception.reason}`);
            (exception.error)? logger.error(`error: ${exception.error.message}`) : null;
            return res.status(422).json({
                status: "fail",
                message: (exception.error)? exception.error.message : exception.reason
            });
        }
        next(exception);
    }
};

module.exports = subscription;