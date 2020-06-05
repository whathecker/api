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
    const packageId = req.params.id;
    try {
        const subscriptionBox = await packageDB.findSubscriptionBoxByPackageId(packageId);

        if (subscriptionBox.status === "fail") {
            logger.warn(`getSubscriptionBoxById request is failed | unknown packageId`);
            return res.status(422).json({
                status: "fail",
                message: subscriptionBox.reason
            });
        }

        logger.info(`getSubscriptionBoxById request is processed | ${subscriptionBox.packageId}`);
        return res.status(200).json(subscriptionBox);
    } catch (exception) {
        next(exception);
    }
};

subscriptionBox.createSubscriptionBox = async (req, res, next) => {
    const channel = req.body.channel;
    const name = req.body.name;
    const boxType = req.body.boxType;
    const boxTypeCode = req.body.boxTypeCode;
    const prices = req.body.prices;

    if (!channel||!name||!boxType||!boxTypeCode||!prices) {
        logger.warn(`createSubscriptionBox request has rejected as param is missing`);
        return res.status(400).json({ 
            status: 'failed',
            message: 'bad request' 
        });
    }

    try {
        const payload = req.body;
        const subscriptionBox = await packageDB.addSubscriptionBox(payload);
        logger.info(`createSubscriptionBox request has created new product | name: ${subscriptionBox.name} productId: ${subscriptionBox.packageId}`);
        return res.status(201).json({
            status: 'success',
            subscriptionBox: subscriptionBox,
            message: 'new subscriptionBox created'
        });

    } catch (exception) {
        if (exception.status === "fail") {
            logger.error(`createSubscriptionBox request has failed | error: ${exception.error.message}`);
            return res.status(422).json({
                status: "fail",
                message: exception.error.message
            });
        } else {
            next(exception);
        }
    }

};

subscriptionBox.updateSubscriptionBox = async (req, res, next) => {
    const channel = req.body.channel;
    const name = req.body.name;
    const boxType = req.body.boxType;
    const boxTypeCode = req.body.boxTypeCode;
    const prices = req.body.prices;

    if (!channel||!name||!boxType||!boxTypeCode||!prices) {
        logger.warn(`updateSubscriptionBox request has rejected as param is missing`);
        return res.status(400).json({ 
            status: 'failed',
            message: 'bad request' 
        });
    }

    try {
        const packageId = req.params.id;
        const payload = req.body;

        const updatedSubscriptionBox = await packageDB.updateSubscriptionBox(packageId, payload);
        const { status, reason } = updatedSubscriptionBox;

        if (status === "fail") {
            logger.warn(`updateSubscriptionBox request has rejected: ${reason} | requested packageId: ${packageId}`);
            return res.status(422).json({
                status: "failed",
                message: reason
            });
        }

        logger.info(`updateSubscriptionBox request has updated the subscriptionBox | name: ${updatedSubscriptionBox.name} productId: ${updatedSubscriptionBox.packageId}`);
        return res.status(200).json({
            status: 'success',
            message: 'subscriptionBox data has updated'
        });
        
    } catch (exception) {
        if (exception.status === "fail") {
            logger.error(`updateSubscriptionBox request has failed | error: ${exception.error.message}`);
            return res.status(422).json({
                status: "fail",
                message: exception.error.message
            });
        } else {
            next(exception);
        }
    }
};

subscriptionBox.deleteSubscriptionBoxById = async (req, res, next) => {
    const packageId = req.params.id;
    try {
        const subscriptionBox = await packageDB.deleteSubscriptionBoxByPackageId(packageId);

        if (subscriptionBox.status === "fail") {
            logger.warn('deleteSubscriptionBoxById request has rejected as packageId is unknown');
            return res.status(422).json({
                status: "fail",
                message: subscriptionBox.reason
            });
        }

        logger.info(`deleteSubscriptionBoxById request has processed: following subscriptionBox has removed: ${subscriptionBox.packageId}`);
        return res.status(200).json({
            status: "success",
            message: "subscriptionBox has removed"
        });

    } catch (exception) {
        next(exception);
    }
};

module.exports = subscriptionBox;