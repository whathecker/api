let SUBSCRIPTIONBOXES = require('../../../db/memory/subscriptionBox');
const createSubscriptionBoxObj = require('../../../../domain/subscriptionBox');

const listSubscriptionBoxes = () => {
    return Promise.resolve(SUBSCRIPTIONBOXES);
};

const findSubscriptionBoxByPackageId = (packageId) => {
    const subscriptionBox = SUBSCRIPTIONBOXES.find(box => {
        return box.packageId === packageId;
    });

    if (!subscriptionBox) {
        return Promise.resolve({
            status: "fail",
            reason: "package not found"
        });
    }

    return Promise.resolve(subscriptionBox);
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

    const new_id = SUBSCRIPTIONBOXES.length + 1;

    const newSubscriptionBox = {
        _id: new_id.toString(),
        ...subscriptionBoxObj
    };
    SUBSCRIPTIONBOXES.push(newSubscriptionBox);

    return Promise.resolve(SUBSCRIPTIONBOXES[SUBSCRIPTIONBOXES.length - 1]);
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
    const subscriptionBox = await findSubscriptionBoxByPackageId(packageId);

    const { status } = subscriptionBox;

    if (status === "fail") {
        return Promise.resolve({
            status: "fail",
            reason: "package not found"
        });
    }

    let deletedSubscriptionBox;
    SUBSCRIPTIONBOXES = SUBSCRIPTIONBOXES.filter(subscriptionBox => {

        if (subscriptionBox.packageId !== packageId) {
            return true;
        }

        if (subscriptionBox.packageId === packageId) {
            deletedSubscriptionBox = subscriptionBox;
            return false;
        }
    });

    return Promise.resolve({
        packageId: deletedSubscriptionBox.packageId,
        status: "success"
    });
};

const dropAll = () => {
    SUBSCRIPTIONBOXES = [];
    return Promise.resolve(SUBSCRIPTIONBOXES);
};

module.exports = {
    listSubscriptionBoxes,
    addSubscriptionBox,
    updateSubscriptionBox,
    findSubscriptionBoxByPackageId,
    deleteSubscriptionBoxByPackageId,
    dropAll
};