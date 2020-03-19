const SkinTypeFactory = require('./factory');

let buildCreateSkinTypeObj = function (skinTypeValidator) {
    return ({
        skinType,
        skinTypeCode
    } = {}) => {

        const result = skinTypeValidator({skinType, skinTypeCode});

        if (result instanceof Error) {
            return result;
        }

        const payload = {
            skinType,
            skinTypeCode
        };
        
        return new SkinTypeFactory(payload);
    }

}


module.exports = buildCreateSkinTypeObj;