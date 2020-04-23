const buildSerializer = require('../../_shared/serializerBuilder');

const __serializeSingleObjEnty = (skinType) => {
    return {
        _id: skinType._id,
        skinType: skinType.skinType,
        skinTypeCode: skinType.skinTypeCode
    };
};

module.exports = buildSerializer(__serializeSingleObjEnty);

