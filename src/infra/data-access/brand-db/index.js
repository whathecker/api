let {
    listBrands,
    findBrandByName,
    addBrand,
    deleteBrandByName,
    dropAll
} = require('./memory');
//require('./mongodb')

module.exports = {
    listBrands,
    findBrandByName,
    addBrand,
    deleteBrandByName,
    dropAll
};