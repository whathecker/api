const packageDB = require('../../../../../../infra/data-access/subscriptionBox-db');
const logger = require('../../../../../_shared/logger');

let subscriptionBox = {};

subscriptionBox.listSubscriptionBoxes = async (req, res, next) => {
    try {
        const subscriptionBoxes = await packageDB.listSubscriptionBoxes();
        logger.info(`listSubscriptionBoxes endpoint has processed and returned subscriptionBoxes`);
        return res.status(200).json({
            status: "success",
            subscriptionBoxes: subscriptionBoxes
        });
    } catch (exception) {
        next(exception);
    }
};

subscriptionBox.getSubscriptionBoxById = async (req, res, next) => {
    return res.status(200).end();
};

subscriptionBox.createSubscriptionBox = async (req, res, next) => {
    return res.status(200).end();
};

subscriptionBox.updateSubscriptionBox = async (req, res, next) => {
    return res.status(200).end();
};

subscriptionBox.deleteSubscriptionBoxById = async (req, res, next) => {
    return res.status(200).end();
};

module.exports = subscriptionBox;