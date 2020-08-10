const userDB = require('../../../../../../../infra/data-access/user-db');
const addressDB = require('../../../../../../../infra/data-access/address-db');
const billingDB = require('../../../../../../../infra/data-access/billing-db');
const subscriptionDB = require('../../../../../../../infra/data-access/subscription-db');
const packageDB = require('../../../../../../../infra/data-access/subscriptionBox-db');
const async = require('async');
const logger = require('../../../../../../_shared/logger');

let user = {};

user.getUserDetail = async (req, res, next) => {
    const userId = req.params.id;

    try {
        const user = await userDB.findUserByUserId(userId);

        const subscriptionId = user.subscriptions[0];

        const subscription = await subscriptionDB.findSubscriptionBySubscriptionId(subscriptionId);
        
        const deliverySchedules = subscription.deliverySchedules.sort(_sortDeliverySchedule);

        const nextDeliverySchedule = deliverySchedules[0];


        let enrichedSubscribedItems = [];

        async.each(subscription.subscribedItems, function (item, callback) {

            packageDB.findSubscriptionBoxByPackageId(item.itemId)
            .then(subscriptionBox => {

                enrichedSubscribedItems.push({
                    packageId: subscriptionBox.packageId,
                    name: subscriptionBox.name,
                    boxType: subscriptionBox.boxType,
                    boxTypeCode: subscriptionBox.boxTypeCode,
                    quantity: item.quantity
                });

                callback();

            }).catch(exception => {

                if (exception.status === "fail") {

                    logger.error(`getUserDetail request has failed | reason: ${exception.reason}`);
                    (exception.error)? logger.error(`error: ${exception.error.message}`) : null;
                    return res.status(422).json({
                        status: "fail",
                        message: (exception.error)? exception.error.message : exception.reason
                    });
                } 
                
                next(exception);
            });
            
        }, function (exception) {

            (exception)? logger.error(exception) : null;
            
            // fetch billingOptions and create an array out of it
            // TODO: write findBillingByUserId method

            // fetch defaultShippingAddress 
    

            return res.status(200).end();
        });

    } catch (exception) {
  
        if (exception.status === "fail") {
            
            if (exception.reason === "user not found") {
                logger.info(`getUserDeail request has not returned user`);
                return res.status(204).json({
                    status: "fail",
                    message: "no user found"
                });
            }

            logger.error(`getUserDetail request has failed | reason: ${exception.reason}`);
            (exception.error)? logger.error(`error: ${exception.error.message}`) : null;
            return res.status(422).json({
                status: "fail",
                message: (exception.error)? exception.error.message : exception.reason
            });
        } 
       
        next(exception);
    }
};

function _sortDeliverySchedule (a, b) {
    if (a.nextDeliveryDate < b.nextDeliveryDate) {
        return -1;
    }
    if (a.nextDeliveryDate > b.nextDeliveryDate) {
        return 1;
    }
    return 0;
}

module.exports = user;