let BILLINGS = require('../../../db/memory/billing');
const createBillingObj = require('../../../../domain/billing');

const listBillings = () => {
    return Promise.resolve(BILLINGS);
};

const findBillingByBillingId = (billingId) => {
    const billing = BILLINGS.find(billing => {
        return billing.billingId === billingId;
    });

    if (!billing) {
        return Promise.reject({
            status: "fail",
            reason: "billing not found"
        });
    }

    return Promise.resolve(billing);
};

const findBillingsByUserId = (userId) => {
    const billings = BILLINGS.filter(billing => {
        return billing.user_id === userId;
    });

    return Promise.resolve(billings);
};

const addBilling = async (payload) => {

    const billingObj = createBillingObj(payload);

    if (billingObj instanceof Error) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: billingObj
        });
    }

    try {
        await _isBillingIdUnique(billingObj.billingId);
    }
    catch (err) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: err
        });
    }

    const new_id = BILLINGS.length + 1;

    const newBilling = {
        _id: new_id.toString(),
        ...billingObj
    };
    BILLINGS.push(newBilling);

    return Promise.resolve(BILLINGS[BILLINGS.length - 1]);
};

async function _isBillingIdUnique (billingId) {
    try {
        await findBillingByBillingId(billingId);
    } catch (err) {
        return;
    }
    throw new Error('db access for billing object failed: billingId must be unique');
}

const deleteBillingByBillingId = async (billingId) => {
    const billing = await findBillingByBillingId(billingId);

    const { status } = billing;

    if (status === "fail") {
        return Promise.reject({
            status: "fail",
            reason: "billing not found"
        });
    }

    let deletedBilling;
    BILLINGS = BILLINGS.filter(billing => {

        if (billing.billingId !== billingId) {
            return true;
        }

        if (billing.billingId === billingId) {
            deletedBilling = billing;
            return false;
        }
    });

    return Promise.resolve({
        billingId: deletedBilling.billingId,
        status: "success"
    });
};

const dropAll = () => {
    BILLINGS = [];
    return Promise.resolve(BILLINGS);
};

module.exports = {
    listBillings,
    findBillingByBillingId,
    findBillingsByUserId,
    addBilling,
    deleteBillingByBillingId,
    dropAll
};