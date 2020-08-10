const dbChoice = require('../_shared/dbAccessModuleSelector')();
let {
    listBillings,
    findBillingByBillingId,
    findBillingsByUserId,
    addBilling,
    deleteBillingByBillingId,
    dropAll
} = require(`./${dbChoice}`);

module.exports = {
    listBillings,
    findBillingByBillingId,
    findBillingsByUserId,
    addBilling,
    deleteBillingByBillingId,
    dropAll
};

