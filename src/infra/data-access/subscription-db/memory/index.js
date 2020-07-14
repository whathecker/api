let SUBSCRIPTIONS = require('../../../db/memory/subscription');
const createSubscriptionObj = require('../../../../domain/subscription');

const listSubscriptions = () => {
    return Promise.resolve(SUBSCRIPTIONS);
};

const findSubscriptionBySubscriptionId = (subscriptionId) => {
    const subscription = SUBSCRIPTIONS.find(subscription => {
        return subscription.subscriptionId === subscriptionId;
    });

    if (!subscription) {
        return Promise.reject({
            status: "fail",
            reason: "subscription not found"
        });
    }

    return Promise.resolve(subscription);
};

const findSubscriptionByUserId = (userId) => {
    const subscriptions = SUBSCRIPTIONS.filter(subscription => {
        return subscription.user_id === userId;
    });
    return Promise.resolve(subscriptions);
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

    const new_id = SUBSCRIPTIONS.length + 1;
    
    const newSubscription = {
        _id: new_id.toString(),
        ...subscriptionObj
    };
    SUBSCRIPTIONS.push(newSubscription);

    return Promise.resolve(SUBSCRIPTIONS[SUBSCRIPTIONS.length - 1]);
};

async function _isSubscriptionIdUnique (subscriptionId) {
    try {
        await findSubscriptionBySubscriptionId(subscriptionId);
    } catch (err) {
        return;
    }

    throw new Error('db access for subscription object failed: productId must be unique');
}

const deleteSubscriptionBySubscriptionId = async (subscriptionId) => {
    const subscription = await findSubscriptionBySubscriptionId(subscriptionId);

    const { status } = subscription;

    if (status === "fail") {
        return Promise.reject({
            status: "fail",
            reason: "subscription not found"
        });
    }

    let deletedSubscription;
    SUBSCRIPTIONS = SUBSCRIPTIONS.filter(subscription => {

        if (subscription.subscriptionId !== subscriptionId) {
            return true;
        }

        if (subscription.subscriptionId === subscriptionId) {
            deletedSubscription = subscription;
            return false;
        }
    });

    return Promise.resolve({
        subscriptionId: deletedSubscription.subscriptionId,
        status: "success"
    });
};

const dropAll = () => {
    SUBSCRIPTIONS = [];
    return Promise.resolve(SUBSCRIPTIONS);
};

module.exports = {
    listSubscriptions,
    findSubscriptionBySubscriptionId,
    findSubscriptionByUserId,
    addSubscription,
    deleteSubscriptionBySubscriptionId,
    dropAll
};