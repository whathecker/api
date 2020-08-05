const dbChoice = require('../_shared/dbAccessModuleSelector')();
let {
    listSubscriptions,
    findSubscriptionBySubscriptionId,
    findSubscriptionByUserId,
    addSubscription,
    updateSubscriptionStatus,
    deleteSubscriptionBySubscriptionId,
    dropAll
} = require(`./${dbChoice}`);

module.exports = {
    listSubscriptions,
    findSubscriptionBySubscriptionId,
    findSubscriptionByUserId,
    addSubscription,
    updateSubscriptionStatus,
    deleteSubscriptionBySubscriptionId,
    dropAll
};