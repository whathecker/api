const dbChoice = require('../_shared/dbAccessModuleSelector')();
const {
    listSubscriptionBoxes,
    addSubscriptionBox,
    findSubscriptionBoxByPackageId,
    deleteSubscriptionBoxByPackageId,
    dropAll
} = require(`./${dbChoice}`);

module.exports = {
    listSubscriptionBoxes,
    addSubscriptionBox,
    findSubscriptionBoxByPackageId,
    deleteSubscriptionBoxByPackageId,
    dropAll
};