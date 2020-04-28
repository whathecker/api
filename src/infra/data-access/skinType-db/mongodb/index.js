const SkinType = require('../../../db/mongodb/models/skinType');
const serializer = require('../mongodb/serializer');
const createSkinTypeObj = require('../../../../domain/skinType');

const listSkinTypes = async () => {
    const skinTypes = await SkinType.find();
    return Promise.resolve(serializer(skinTypes));
};

const findSkinTypeByName = async (skinTypeName) => {
    const skinType = await SkinType.findOne({ skinType: skinTypeName });

    if (!skinType) {
        return Promise.resolve({
            status: "fail",
            reason: "skinType not found"
        });
    }

    return Promise.resolve(serializer(skinType));
};

const addSkinType = async (payload) => {

    const skinTypeObj = createSkinTypeObj(payload);

    if (skinTypeObj instanceof Error) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: skinTypeObj
        });
    }

    
    try {
        await _isSkinTypeUnique(skinTypeObj.skinType);
        await _isSkinTypeCodeUnique(skinTypeObj.skinTypeCode);
    }
    catch (err) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: err
        });
    } 

    const newSkinType = await SkinType.create(skinTypeObj);

    return Promise.resolve(serializer(newSkinType));
};

async function _isSkinTypeUnique (skinType) {
    const quriedSkinType = await findSkinTypeByName(skinType);

    const { status } = quriedSkinType;

    if (status === "fail") return;
    

    throw new Error("db access for skinType object failed: skinType must be unique");
}

async function _isSkinTypeCodeUnique (skinTypeCode) {
    const skinType = await SkinType.findOne({ 
        skinTypeCode: skinTypeCode 
    });

    if (!skinType) return;
    
    throw new Error("db access for skinType object failed: skinTypeCode must be unique");
}

const deleteSkinTypeByName = async (skinTypeName) => {
    const removedSkinType = await SkinType.findOneAndRemove({
        skinType: skinTypeName
    });

    if (!removedSkinType) {
        return Promise.resolve({
            status: "fail",
            reason: "skinType not found"
        });
    }

    if (removedSkinType) {
        return Promise.resolve({
            _id: removedSkinType._id,
            status: "success"
        });
    }
};

const dropAll = async () => {
    return SkinType.remove();
};

module.exports = {
    listSkinTypes,
    findSkinTypeByName,
    addSkinType,
    deleteSkinTypeByName,
    dropAll
};

