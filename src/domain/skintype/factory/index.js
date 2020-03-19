const enumSkinType = Object.freeze({
    0: 'dry',
    1: 'normal',
    2: 'oily'
});

const enumSkinTypeCode = Object.freeze({
    'dry': 'DR',
    'normal': 'NM',
    'oily': 'OL'
});


class SkinTypeFactory {
    constructor({
        skinType,
        skinTypeCode
    } ={}) {

        let result = SkinTypeFactory.validateSkinType(skinType);

        if (!result) {
            return new Error('skinType field contain invalid value');
        }


        skinTypeCode = enumSkinTypeCode[skinType];

        if (!skinTypeCode) {
            return new Error('skinTypeCode yield invalid value: check your skinType input');
        }
        

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

module.exports = SkinTypeFactory;