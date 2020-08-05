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

const updateSubscriptionStatus = async (subscriptionId, isActive) => {
    const subscription = await findSubscriptionBySubscriptionId(subscriptionId);
    const { status, _id, ...rest } = subscription;

    if (status === "fail") {
        return Promise.reject({
            status: "fail",
            reason: "subscription not found"
        });
    }

    const newSubscriptionStatus = isActive;

    try {
        _compareStatus(newSubscriptionStatus, subscription.isActive);
    } catch (err) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: err
        });
    }

    let updatedPayload = rest;
    updatedPayload.isActive = newSubscriptionStatus;

    if (updatedPayload.isActive === true) {
        const newFulfillmentSchedule = _setFirstFulfillmentSchedule(updatedPayload.deliveryDay);
        updatedPayload.deliverySchedules = [newFulfillmentSchedule];
    }

    const subscriptionObj = createSubscriptionObj(updatedPayload);

    if (subscriptionObj instanceof Error) {
        return Promise.reject({
            status: "fail",
            reaason: "error",
            error: subscriptionObj
        });
    }

    const updatedSubscription = {
        _id: _id,
        ...subscriptionObj
    };
    const index_in_db_array = parseInt(_id) - 1;
    SUBSCRIPTIONS[index_in_db_array] = updatedSubscription;

    return Promise.resolve(SUBSCRIPTIONS[index_in_db_array]);
};

function _compareStatus(newStatus, oldStatus) {
    if (newStatus === oldStatus) {
        throw new Error(`db access for updating subscription object failed: cannot update status of subscription to same state - old status was already ${oldStatus}`);
    }
}

function _setFirstFulfillmentSchedule (fulfillMentDay = 4) {
    const timestamp = new Date(Date.now());
    const dayAtTimestamp = timestamp.getDay();
    
    let gapTillNextClosestFullfillmentDate;

    if (dayAtTimestamp < fulfillMentDay) {
        gapTillNextClosestFullfillmentDate = fulfillMentDay - dayAtTimestamp;
    }

    if (dayAtTimestamp > fulfillMentDay) {
        gapTillNextClosestFullfillmentDate = 7 - (dayAtTimestamp - fulfillMentDay);
    }
    
    if (dayAtTimestamp === fulfillMentDay) {
        gapTillNextClosestFullfillmentDate = 1;
    }

    const deliveryDateinMSeconds = timestamp + (gapTillNextClosestFullfillmentDate * 24 * 60 * 60 * 1000);
    const deliveryDateInObj = new Date(deliveryDateinMSeconds);
    const deliverySchedule = {
        orderNumber: ' ',
        nextDeliveryDate: deliveryDateInObj,
        year: deliveryDateInObj.getFullYear(),
        month: deliveryDateInObj.getMonth(),
        date: deliveryDateInObj.getDate(),
        day: deliveryDateInObj.getDay()
    };

    return deliverySchedule;
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
    updateSubscriptionStatus,
    deleteSubscriptionBySubscriptionId,
    dropAll
};