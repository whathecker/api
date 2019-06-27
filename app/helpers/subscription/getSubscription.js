const Subscription = require('../../models/Subscription');
const logger = require('../../utils/logger');
function getSubscription (req, res, next) {
    
    const subscriptionId = req.params.subscriptionId;
    console.log(subscriptionId);

    if (!subscriptionId) {
        logger.warn('/subscriptions/subscription request returned 422, parameter is missing');
        return res.status(422).json({
            status: res.status,
            message: 'bad request: missing parameter'
        });
    } else {
        Subscription.findOne({ subscriptionId: subscriptionId })
        .populate('package')
        .populate('paymentMethod')
        .populate({
            path: 'user',
            populate: { path: 'defaultShippingAddress'}
        })
        .populate({
            path: 'user',
            populate: { path: 'defaultBillingAddress'}
        })
        .then((subscription) => {
            console.log(subscription);
            
            if (subscription) {
                logger.info('/subscriptions/subscription request returned 200');
                return res.status(200).json({
                    status: res.status,
                    message: 'subscription has returned',
                    subscriptionId: subscription.subscriptionId,
                    userEmail: subscription.user.email,
                    firstName: subscription.user.firstName,
                    lastName: subscription.user.lastName,
                    packageName: subscription.package.name,
                    price: subscription.package.prices[0].price,
                    paymentMethod: {
                        type: subscription.paymentMethod.type,
                        reference: subscription.paymentMethod.recurringDetail
                    },
                    shippingAddress: {
                        postalCode: subscription.user.defaultShippingAddress.postalCode,
                        houseNumber: subscription.user.defaultShippingAddress.houseNumber,
                        houseNumberAdd: subscription.user.defaultShippingAddress.houseNumberAdd,
                        mobileNumber: subscription.user.defaultShippingAddress.mobileNumber,
                        streetName: subscription.user.defaultShippingAddress.streetName,
                        city: subscription.user.defaultShippingAddress.city,
                        province: subscription.user.defaultShippingAddress.province,
                        country: subscription.user.defaultShippingAddress.country
                    },
                    billingAddress: {
                        postalCode: subscription.user.defaultBillingAddress.postalCode,
                        houseNumber: subscription.user.defaultBillingAddress.houseNumber,
                        houseNumberAdd: subscription.user.defaultBillingAddress.houseNumberAdd,
                        mobileNumber: subscription.user.defaultBillingAddress.mobileNumber,
                        streetName: subscription.user.defaultBillingAddress.streetName,
                        city: subscription.user.defaultBillingAddress.city,
                        province: subscription.user.defaultBillingAddress.province,
                        country: subscription.user.defaultBillingAddress.country
                    },
                    deliveryFrequncy: subscription.deliveryFrequncy,
                    deliveryDay: subscription.deliveryDay,
                    firstDeliverySchedule: subscription.firstDeliverySchedule,
                    nextDeliverySchedule: subscription.nextDeliverySchedule,
                    deliverySchedules: subscription.deliverySchedules
                });
            } else {
                logger.info('/subscriptions/subscription request returned 204, no data found')
                return res.status(204).json({
                    status: res.status,
                    message: 'subscription not found'
                });
            }
        }).catch(next);
    }
}

module.exports = getSubscription;