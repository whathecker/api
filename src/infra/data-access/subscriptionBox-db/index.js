const dbChoice = require('../_shared/dbAccessModuleSelector')();
const {
    listSubscriptionBoxes,
    findSubscriptionBoxByPackageId,
    deleteSubscriptionBoxByPackageId,
    dropAll
} = require(`./${dbChoice}`);

module.exports = {
    listSubscriptionBoxes,
    findSubscriptionBoxByPackageId,
    deleteSubscriptionBoxByPackageId,
    dropAll
};