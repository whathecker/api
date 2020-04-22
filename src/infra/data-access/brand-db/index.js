const dbChoice = require('../_shared/dbAccessModuleSelector')();
let {
    listBrands,
    findBrandByName,
    addBrand,
    deleteBrandByName,
    dropAll
} = require(`./${dbChoice}`);


module.exports = {
    listBrands,
    findBrandByName,
    addBrand,
    deleteBrandByName,
    dropAll
};