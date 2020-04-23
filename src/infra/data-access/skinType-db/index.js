const dbChoice = require('../_shared/dbAccessModuleSelector')();
let {
    listSkinTypes,
    findSkinTypeByName,
    addSkinType,
    deleteSkinTypeByName,
    dropAll
} =  require(`./${dbChoice}`);

module.exports = {
    listSkinTypes,
    findSkinTypeByName,
    addSkinType,
    deleteSkinTypeByName,
    dropAll
};