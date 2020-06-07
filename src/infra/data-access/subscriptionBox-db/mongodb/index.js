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
    const subscriptionBox = await findSubscriptionBoxByPackageId(id);
    const {status, _id, packageId, ...rest} = subscriptionBox;
    let updatedPayload;

    if (status === "fail") {
        return Promise.resolve({
            status: "fail",
            reason: "subscriptionBox not found"
        });
    }

    try {
        updatedPayload = _buildUpdatedPayload(payload, subscriptionBox);
    } catch (err) {
        return Promise.reject({
            status: "fail",
            reason: "cannot update immutable fields",
            error: err
        });
    }
    
    const subscriptionBoxObj = createSubscriptionBoxObj(updatedPayload);

    if (subscriptionBoxObj instanceof Error) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: subscriptionBoxObj
        });
    }

    const updatedSubscriptionBox = await SubscriptionBox.findOneAndUpdate({
        packageId: packageId
    }, subscriptionBoxObj, { new : true });

    return Promise.resolve(serializer(updatedSubscriptionBox));
};

function _buildUpdatedPayload (payload, subscriptionBox) {

    const fieldsToCheckInPayload = {
        boxType: payload.boxType,
        boxTypeCode: payload.boxTypeCode,
    };

    const fieldsToCheckInSubscriptionBox = {
        boxType: subscriptionBox.boxType,
        boxTypeCode: subscriptionBox.boxTypeCode,
    };

    const result_immutableFields_update = _isImmutableFieldsUpdated(fieldsToCheckInPayload, fieldsToCheckInSubscriptionBox);
    const { status, updatedField } = result_immutableFields_update;

    if (status === true) {
        throw new Error(`db access for subscriptionBox object failed: ${updatedField} cannot be updated after subscriptionBox has created`);
    }

    let updatedPayload = payload;
    updatedPayload.packageId = subscriptionBox.packageId;
    updatedPayload.lastModified = new Date(Date.now());
    return updatedPayload;
}

function _isImmutableFieldsUpdated (fields_in_payload, fields_in_product) {
    let result = {
        status: false,
        updatedField: null
    };

    for (let prop of Object.keys(fields_in_payload)) {
        if (fields_in_payload[prop] !== fields_in_product[prop]) {
            result.status = true;
            result.updatedField = prop;
            break;
        }
    }
    return result;
}

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