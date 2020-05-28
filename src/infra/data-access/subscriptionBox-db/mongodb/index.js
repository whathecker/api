const SubscriptionBox = require('../../../db/mongodb/models/subscriptionBox');
const serializer = require('./serializer');
const createSubscriptionBoxObj = require('../../../../domain/subscriptionBox');

const listSubscriptionBoxes = async () => {
    const subscriptionBoxes = await SubscriptionBox.find();
    return Promise.resolve(serializer(subscriptionBoxes));
};

const findSubscriptionBoxByPackageId = async (packageId) => {
    const subscriptionBox = await SubscriptionBox.findOne({
        packageId: packageId
    });

    if (!subscriptionBox) {
        return Promise.resolve({
            status: "fail",
            reason: "subscriptionBox not found"
        }); 
    }

    return Promise.resolve(serializer(subscriptionBox));
};

const addSubscriptionBox = async (payload) => {

    const subscriptionBoxObj = createSubscriptionBoxObj(payload);

    if (subscriptionBoxObj instanceof Error) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: subscriptionBoxObj
        });
    }

    try {
        await _isPackageIdUnique(subscriptionBoxObj.packageId);
    }
    catch (err) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: err
        });
    }

    const newSubscriptionBox = await SubscriptionBox.create(subscriptionBoxObj);

    return Promise.resolve(serializer(newSubscriptionBox));
};

async function _isPackageIdUnique (packageId) {
    const subscriptionBox = await findSubscriptionBoxByPackageId(packageId);

    const { status } = subscriptionBox;

    if (status === "fail") return;

    throw new Error('db access for package object failed: packageId must be unique');
}

const updateSubscriptionBox = async (id, payload) => {

};

const deleteSubscriptionBoxByPackageId = async (packageId) => {
    const removedSubscriptionBox = await SubscriptionBox.findOneAndRemove({
        packageId: packageId
    });

    if (!removedSubscriptionBox) {
        return Promise.resolve({
            status: "fail",
            reason: "subscriptionBox not found"
        }); 
    }

    if (removedSubscriptionBox) {
        return Promise.resolve({
            packageId: removedSubscriptionBox.packageId,
            status: "success"
        });
    }
};

const dropAll = async () => {
    return SubscriptionBox.remove();
};

module.exports = {
    listSubscriptionBoxes,
    addSubscriptionBox,
    updateSubscriptionBox,
    findSubscriptionBoxByPackageId,
    deleteSubscriptionBoxByPackageId,
    dropAll
};