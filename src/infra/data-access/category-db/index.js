const dbChoice = require('../_shared/dbAccessModuleSelector')();
let {
    listCategories,
    findCategoryByName,
    addCategory,
    deleteCategoryByName,
    dropAll
} = require(`./${dbChoice}`);

module.exports = {
    listCategories,
    findCategoryByName,
    addCategory,
    deleteCategoryByName,
    dropAll
};