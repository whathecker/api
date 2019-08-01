const User = require('../../models/User');
const SubscriptionBox = require('../../models/SubscriptionBox');
const logger = require('../../utils/logger');
const async = require('async');

async function getUserDetail (req, res, next) {
    
    if (req.user) {
        User.findById(req.user._id)
        .populate('defaultShippingAddress')
        .populate('billingOptions')
        .populate('subscriptions')
        .then((user) => {
            if (user) {
                //console.log(user);            

                let billingOptions = [];
                for (let i = 0; i < user.billingOptions.length; i++) {
                    const billingOption = {
                        id: user.billingOptions[i].recurringDetail,
                        type: user.billingOptions[i].type
                    }
                    billingOptions.push(billingOption);
                }

                const deliverySchedules = user.subscriptions[0].deliverySchedules;
                const sortedDeliverySchedules = Array.from(deliverySchedules).sort((a, b) => {
                    if (a.nextDeliveryDate < b.nextDeliveryDate) {
                        return -1;
                    }
                    if (a.nextDeliveryDate > b.nextDeliveryDate) {
                        return 1;
                    }
                    return 0;
                });

                // find next un-processed deliveryschedule
                let nextDelivery = null;
                for (let i = 0; i < sortedDeliverySchedules.length; i++) {
                    const isProcessed = sortedDeliverySchedules[i].isProcessed;
                    //const isActive = sortedDeliverySchedules[i].isActive;

                    if ((isProcessed === false)) {
                        nextDelivery = sortedDeliverySchedules[i];
                        break;
                    }
                }

                
                let enrichedItems = [];
                const items = user.subscriptions[0].subscribedItems;

                async.each(items, function(item, callback){
                    SubscriptionBox.findOne({id: item.itemId})
                    .then((subscriptionBox) => {
                        const subscribedItem = {
                            id: subscriptionBox.id,
                            boxType: subscriptionBox.boxType,
                            quantity: item.quantity
                        }
                        enrichedItems.push(subscribedItem);
                        callback();
                    }).catch(next);
                    
                }, function (err) {
                    if (err) {
                        console.warn(err);
                    } else {
        
                        const userData = {
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            mobileNumber: user.mobileNumber,
                            address: {
                                streetName: user.defaultShippingAddress.streetName,
                                houseNumber: user.defaultShippingAddress.houseNumber,
                                houseNumberAdd: user.defaultShippingAddress.houseNumberAdd,
                                city: user.defaultShippingAddress.city,
                                province: user.defaultShippingAddress.province,
                                country: user.defaultShippingAddress.country
                            },
                            subscription: {
                                id: user.subscriptions[0].subscriptionId,
                                creationDate: user.subscriptions[0].creationDate,
                                deliveryFrequency: user.subscriptions[0].deliveryFrequency,
                                delivertyDay: user.subscriptions[0].deliveryDay,
                                nextDelivery: nextDelivery
                            },
                            subscribedItems: enrichedItems,
                            billingOptions: billingOptions
                        }

                        logger.info(`getUserDeail request has returned user ${user.email}`);
                        return res.status(200).json(userData);
                    }
                });

            } else {
                logger.info(`getUserDeail request has not returned user`);
                return res.status(204).json({
                    status: "failed",
                    message: 'no user'
                });
            }
        }).catch(next);
    }
}

module.exports = getUserDetail;