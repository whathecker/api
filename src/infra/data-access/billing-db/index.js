const dbChoice = require('../_shared/dbAccessModuleSelector')();
let {
    listBillings,
    findBillingByBillingId,
    addBilling,
    deleteBillingByBillingId,
    dropAll
} = require(`./${dbChoice}`);

module.exports = {
    listBillings,
    findBillingByBillingId,
    addBilling,
    deleteBillingByBillingId,
    dropAll
};

