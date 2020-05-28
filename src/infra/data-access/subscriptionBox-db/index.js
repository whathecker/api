const dbChoice = require('../_shared/dbAccessModuleSelector')();
const {
    listSubscriptionBoxes,
    addSubscriptionBox,
    updateSubscriptionBox,
    findSubscriptionBoxByPackageId,
    deleteSubscriptionBoxByPackageId,
    dropAll
} = require(`./${dbChoice}`);

module.exports = {
    listSubscriptionBoxes,
    addSubscriptionBox,
    updateSubscriptionBox,
    findSubscriptionBoxByPackageId,
    deleteSubscriptionBoxByPackageId,
    dropAll
};