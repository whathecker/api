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
            reason: "cannot update fixed fields",
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

    const updatedSubscriptionBox = {
        _id: _id,
        ...subscriptionBoxObj
    };
    const index_in_db_array = parseInt(_id) - 1;
    SUBSCRIPTIONBOXES[index_in_db_array] = updatedSubscriptionBox;
    
    return Promise.resolve(SUBSCRIPTIONBOXES[index_in_db_array]);
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

    const result_fixedFields_update = _isFixedfieldsUpdate(fieldsToCheckInPayload, fieldsToCheckInSubscriptionBox);
    const { status, updatedField } = result_fixedFields_update;

    if (status === true) {
        throw new Error(`db access for subscriptionBox object failed: ${updatedField} cannot be updated after subscriptionBox has created`);
    }

    let updatedPayload = payload;
    updatedPayload.packageId = subscriptionBox.packageId;
    updatedPayload.lastModified = new Date(Date.now());
    return updatedPayload;
}

function _isFixedfieldsUpdate (fields_in_payload, fields_in_product) {
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