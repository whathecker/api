const SkinType = require('../../../models/SkinType');

const skinTypeInterfaces = {};

/**
 * public method: createSkinTypeInstance
 * @param {object} skinTypeDetail:
 * object contain skinType ield
 * 
 * Return: new instance of SkinType model
 */

skinTypeInterfaces.createSkinTypeInstance = (skinTypeDetail) => {
    
    if (!skinTypeDetail) {
        throw new Error('Missing argument: cannnot create Brand instance without skinTypeDetail argument');
    }

    const skinType = new SkinType();
    skinType.skinType = skinTypeDetail.skinType;
    skinType.skinTypeCode = skinType.setSkinTypeCode(skinType.skinType);
    
    return skinType;
}
module.exports = skinTypeInterfaces;