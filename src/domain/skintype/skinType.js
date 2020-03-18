const enumSkinType = Object.freeze({
    0: 'dry',
    1: 'normal',
    2: 'oily'
});

const enumSkinTypeCode = Object.freeze({
    dry: 'DR',
    normal: 'NM',
    oily: 'OL'
});

let buildCreateSkinTypeObj = function (skinTypeValidator) {
    return ({
        skinType
    } = {}) => {

        const result = skinTypeValidator({skinType});

        if (result instanceof Error) {
            return result;
        }

        return new SkinTypeFactory(skinType);
    }

}

class SkinTypeFactory {
    constructor(skinType) {
        let result = SkinTypeFactory.validateSkinType(skinType);

        if (!result) {
            return new Error('skinType field contain invalid value');
        }

        const skinTypeCode = enumSkinTypeCode[skinType];
        return new SkinType(skinType, skinTypeCode);
    }

    static validateSkinType (skinType) {
        let result = false;

        for (let prop of Object.keys(enumSkinType)) {
            
            if (skinType === enumSkinType[prop]) {
                result = true;
                break;
            }
        }  

        return result;
    }

}

class SkinType {
    constructor(skinType, skinTypeCode) {
        this.skinType = skinType;
        this.skinTypeCode = skinTypeCode;
    }
}

module.exports = buildCreateSkinTypeObj;