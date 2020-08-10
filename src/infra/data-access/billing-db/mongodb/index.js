const Billing = require('../../../db/mongodb/models/billing');
const serializer = require('./serializer');
const createBillingObj = require('../../../../domain/billing');

const listBillings = async () => {
    const billings = await Billing.find();
    return Promise.resolve(serializer(billings));
};

const findBillingByBillingId = async (billingId) => {
    const billing = await Billing.findOne({ billingId: billingId });

    if (!billing) {
        return Promise.reject({
            status: "fail",
            reason: "billing not found"
        });
    }

    return Promise.resolve(serializer(billing));
};

const findBillingsByUserId = () => {

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

    const newBilling = await Billing.create(billingObj);

    return Promise.resolve(serializer(newBilling));
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
    const removedBilling = await Billing.findOneAndRemove({
        billingId: billingId
    });

    if (!removedBilling) {
        return Promise.reject({
            status: "fail",
            reason: "billing not found"
        });
    }

    if (removedBilling) {
        return Promise.resolve({
            billingId: removedBilling.billingId,
            status: "success"
        });
    }
};

const dropAll = async () => {
    return Billing.remove();
};

module.exports = {
    listBillings,
    findBillingByBillingId,
    findBillingsByUserId,
    addBilling,
    deleteBillingByBillingId,
    dropAll
};