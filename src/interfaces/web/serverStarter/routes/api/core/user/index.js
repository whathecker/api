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
            
        }, async function (exception) {

            (exception)? logger.error(exception) : null;

            const billings = await billingDB.findBillingsByUserId(user.userId);

            const address_id = user.defaultShippingAddress;
            const defaultShippingAddress = await addressDB.findAddressById(address_id);

            const userData = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                mobileNumber: user.mobileNumber,
                address: {
                    streetName: defaultShippingAddress.streetName,
                    houseNumber: defaultShippingAddress.houseNumber,
                    houseNumberAdd: defaultShippingAddress.houseNumberAdd,
                    city: defaultShippingAddress.city,
                    province: defaultShippingAddress.province,
                    country: defaultShippingAddress.country
                },
                subscription: {
                    id: subscription.subscriptionId,
                    creationDate: subscription.creationDate,
                    deliveryFrequency: subscription.deliveryFrequency,
                    deliveryDay: subscription.deliveryDay,
                    nextDelivery: nextDeliverySchedule
                },
                subscribedItems: enrichedSubscribedItems,
                billingOptions: billings
            };
    
            logger.info(`getUserDeail request has returned user ${user.email}`);
            return res.status(200).json(userData);
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


user.getUserAddresses = async (req, res, next) => {
    const userId = req.params.id;
    try {
        const user = await userDB.findUserByUserId(userId);

        const addresses = await addressDB.listAddressesByUserId(user.userId);

        let defaultShippingAddress = null;
        let defaultBillingAddress = null;

        if (user.defaultShippingAddress) {
            defaultShippingAddress = await addressDB.findAddressById(user.defaultShippingAddress);
        }

        if (user.defaultBillingAddress) {
            defaultBillingAddress = await addressDB.findAddressById(user.defaultBillingAddress);
        }
        
        const addressData = {
            addresses: addresses,
            shippingAddress: defaultShippingAddress,
            billingAddress: defaultBillingAddress
        }
        logger.info(`getUserAddresses request has returned data ${user.email}`);
        return res.status(200).json(addressData);
    } catch (exception) {
        if (exception.status === "fail") {
            
            if (exception.reason === "user not found") {
                logger.info(`getUserAddresses request has not returned data - no user`);
                return res.status(204).json({
                    status: "fail",
                    message: "no user found"
                });
            }

            logger.error(`getUserAddresses request has failed | reason: ${exception.reason}`);
            (exception.error)? logger.error(`error: ${exception.error.message}`) : null;
            return res.status(422).json({
                status: "fail",
                message: (exception.error)? exception.error.message : exception.reason
            });
        } 
       
        next(exception);
    };
};

module.exports = user;