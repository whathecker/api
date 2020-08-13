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
                return res.status(404).json({
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
        };
        logger.info(`getUserAddresses request has returned data ${user.email}`);
        return res.status(200).json(addressData);
    } catch (exception) {
        if (exception.status === "fail") {
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

user.upsertAddress = async (req, res, next) => {
    const userId = req.params.id;
    
    const address_id = req.body.id;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const postalCode = req.body.postalCode;
    const houseNumber = req.body.houseNumber;
    const streetName = req.body.streetName;
    const city = req.body.city;
    const country = req.body.country;

    if (!firstName || !lastName || !postalCode || !houseNumber || !streetName || !city || !country) {
        logger.warn(`upsertAddress request has failed - bad request: missing parameter`);
        return res.status(400).json({
            status: "fail",
            message: "bad request - missing parameter(s)"
        });
    }

    try {
        let user = await userDB.findUserByUserId(userId);

        let payload = req.body;
        payload.user_id = user.userId;
        delete payload.id;

        if (!address_id) {    
            
            const address = await addressDB.addAddress(payload);

            user.addresses.push(address._id.toString());
            const updatedAddresses = user.addresses;
            
            await userDB.updateUserAddresses(user.userId, updatedAddresses);
            
            logger.info(`upsertAddress request has created new address: ${address._id}`);
            return res.status(201).json({
                status: "success",
                message: 'new address has created'
            });
        }

        if (address_id) {
            await addressDB.updateAddress(address_id, payload);
            logger.info(`upsertAddress request has updated existing address ${address_id}`);
            return res.status(200).json({
                status: "success",
                message: "address has updated"
            });
        }

    } catch (exception) {
        
        if (exception.status === "fail") {
            logger.error(`upsertAddress request has failed | reason: ${exception.reason}`);
            (exception.error)? logger.error(`error: ${exception.error.message}`) : null;
            return res.status(422).json({
                status: "fail",
                message: (exception.error)? exception.error.message : exception.reason
            });
        } 

        if (exception.name === 'CastError') {
            logger.error(`upsertAddress request has failed | reason: ${exception.message}`);
            return res.status(422).json({
                status: "fail",
                message: exception.message
            });
        }

        next(exception);
    }
};

user.deleteUserAddress = async (req, res, next) => {
   
    const userId = req.params.id;
    const address_id = req.params.address_id;

    try {
        let user = await userDB.findUserByUserId(userId);

        await _isDefaultAddressesUpdated(address_id, user);

        await addressDB.deleteAddressById(address_id);

        const newAddresses = user.addresses.filter(id => id !== address_id);

        await userDB.updateUserAddresses(user.userId, newAddresses);

        logger.info(`deleteUserAddress request has deleted address - address_id: ${address_id}`);
        return res.status(200).json({
            status: "success",
            message: "address has deleted"
        });

    } catch (exception) {
        if (exception.status === "fail") {
            logger.error(`deleteUserAddress request has failed | reason: ${exception.reason}`);
            (exception.error)? logger.error(`error: ${exception.error.message}`) : null;
            return res.status(422).json({
                status: "fail",
                message: (exception.error)? exception.error.message : exception.reason
            });
        } 

        if (exception.name === 'CastError') {
            logger.error(`deleteUserAddress request has failed | reason: ${exception.message}`);
            return res.status(422).json({
                status: "fail",
                message: exception.message
            });
        }

        next(exception);
    }
};

function _isDefaultAddressesUpdated (address_id, userObj) {
    if (address_id === userObj.defaultShippingAddress) {
        return Promise.reject({
            status: "fail",
            reason: "cannot update default shipping address"
        });
    }

    if (address_id === userObj.defaultBillingAddress) {
        return Promise.reject({
            status: "fail",
            reason: "cannot update default billing address"
        });
    }
};

module.exports = user;