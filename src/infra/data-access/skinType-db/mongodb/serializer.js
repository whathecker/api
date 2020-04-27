const buildSerializer = require('../../_shared/serializerBuilder');

const __serializeSingleObjEntry = (skinType) => {
    return {
        _id: skinType._id,
        skinType: skinType.skinType,
        skinTypeCode: skinType.skinTypeCode
    };
};

module.exports = buildSerializer(__serializeSingleObjEntry);

