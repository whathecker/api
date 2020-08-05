const Subscription = require('../../../db/mongodb/models/subscription');
const serializer = require('./serializer');
const createSubscriptionObj = require('../../../../domain/subscription');

const listSubscriptions = async () => {
    const subscriptions = await Subscription.find();
    return Promise.resolve(serializer(subscriptions));
};

const findSubscriptionBySubscriptionId = async (subscriptionId) => {
    const subscription = await Subscription.findOne({
        subscriptionId: subscriptionId
    });

    if (!subscription) {
        return Promise.reject({
            status: "fail",
            reason: "subscription not found"
        });
    }

    return Promise.resolve(serializer(subscription));
};

const findSubscriptionByUserId = async (user_id) => {
    const subscriptions = await Subscription.find({ user_id: user_id });
    return Promise.resolve(serializer(subscriptions));
};

const addSubscription = async (payload) => {

    const subscriptionObj = createSubscriptionObj(payload);

    if (subscriptionObj instanceof Error) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: subscriptionObj
        });
    }

    try {
        await _isSubscriptionIdUnique(subscriptionObj.subscriptionId);
    }
    catch (err) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: err
        });
    }

    const newSubscription = await Subscription.create(subscriptionObj);

    return Promise.resolve(serializer(newSubscription));
};

async function _isSubscriptionIdUnique (subscriptionId) {
    try {
        await findSubscriptionBySubscriptionId(subscriptionId);
    } catch (err) {
        return;
    }
 
    throw new Error('db access for subscription object failed: productId must be unique');
}

const updateSubscriptionStatus = async (subscriptionId, isActive) => {

};

const deleteSubscriptionBySubscriptionId = async (subscriptionId) => {
    const removedSubscription = await Subscription.findOneAndRemove({
        subscriptionId: subscriptionId
    });

    if (!removedSubscription) {
        return Promise.reject({
            status: "fail",
            reason: "subscription not found"
        });
    }

    if (removedSubscription) {
        return Promise.resolve({
            subscriptionId: removedSubscription.subscriptionId,
            status: "success"
        });
    }
};

const dropAll = async () => {
    return Subscription.remove();
};

module.exports = {
    listSubscriptions,
    findSubscriptionBySubscriptionId,
    findSubscriptionByUserId,
    addSubscription,
    updateSubscriptionStatus,
    deleteSubscriptionBySubscriptionId,
    dropAll
};