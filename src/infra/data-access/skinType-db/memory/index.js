let SKINTYPES = require('../../../db/memory/skinType');
const createSkinTypeObj = require('../../../../domain/skinType');

const listSkinTypes = () => {
    return Promise.resolve(SKINTYPES);
};

const findSkinTypeByName = (skinTypeName) => {
    const skinType = SKINTYPES.find(skinType => {
        // TODO: see how confusing below skinType.skinType is
        // please rename it 
        return skinType.skinType === skinTypeName;
    });

    if (!skinType) {
        return Promise.resolve({
            status: "fail",
            reason: "skinType not found"
        });
    }

    return Promise.resolve(skinType);
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

    const new_id = SKINTYPES.length + 1;

    const newSkinType = {
        _id: new_id.toString(),
        skinType: skinTypeObj.skinType,
        skinTypeCode: skinTypeObj.skinTypeCode
    };
    SKINTYPES.push(newSkinType);

    return Promise.resolve(SKINTYPES[SKINTYPES.length - 1]);
};

async function _isSkinTypeUnique (skinType) {
    const quriedSkinType = await findSkinTypeByName(skinType);

    const { status } = quriedSkinType;

    if (status === "fail") return;

    throw new Error("db access for skinType object failed: skinType must be unique");
}

function _isSkinTypeCodeUnique (skinTypeCode) {
    const skinType = SKINTYPES.find(skinType => {
        return skinType.skinTypeCode === skinTypeCode;
    });

    if (!skinType) return;

    throw new Error("db access for skinType object failed: skinTypeCode must be unique");
}

const deleteSkinTypeByName = async (skinTypeName) => {

    const skinType = await findSkinTypeByName(skinTypeName);

    const { status } = skinType;

    if (status === "fail") {
        return Promise.resolve({
            status: "fail",
            reason: "skinType not found"
        });
    }

    let deleteSkinType;
    SKINTYPES = SKINTYPES.filter(skinType => {

        if (skinType.skinType !== skinTypeName) {
            return true;
        }

        if (skinType.skinType === skinTypeName) {
            deleteSkinType = skinType;
            return false;
        }
    });

    return Promise.resolve({
        _id: deleteSkinType._id,
        status: "success"
    });
};

const dropAll = () => {
    SKINTYPES = [];
    return Promise.resolve(SKINTYPES);
};

module.exports = {
    listSkinTypes,
    findSkinTypeByName,
    addSkinType,
    deleteSkinTypeByName,
    dropAll
};