const Subscription = require('../../../db/mongodb/models/subscription');
const createSubscriptionObj = require('../../../../domain/subscription');
const serializer = require('./serializer');
const helpers = require('../../_shared/helpers');

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

    updatedPayload = helpers.removeNullsFromObject(updatedPayload);

    const subscriptionObj = createSubscriptionObj(updatedPayload);

    if (subscriptionObj instanceof Error) {
        return Promise.reject({
            status: "fail",
            reaason: "error",
            error: subscriptionObj
        });
    }

    const updatedSubscription = await Subscription.findOneAndUpdate({
        subscriptionId: subscriptionId
    }, subscriptionObj, { new: true});

    return Promise.resolve(serializer(updatedSubscription));
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