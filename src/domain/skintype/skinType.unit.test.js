const buildCreateSkinTypeObj = require('./skinType');
const skinTypeSchema = require('./skinType-schema');
const validator = require('../_shared_validator')(skinTypeSchema);

const makeSkinTypeObj = buildCreateSkinTypeObj(validator);

const dummyData = Object.freeze({
    valid_dry: {
        skinType: 'dry'
    },
    valid_normal: {
        skinType: 'normal'
    },
    valid_oily: {
        skinType: 'oily'
    },
    invalid_name_type: {
        skinType: true
    },
    incomplete_name: {
        skinTypes: 'normal'
    },
    incorrect_name_oily: {
        skinType: 'oilyy'
    },
    incorrect_name_normal: {
        skinType: 'normala'
    },
    incorrect_name_dry: {
        skinType: 'drys'
    }
});

const errorMessages = Object.freeze({
    typeError_skinType: 'SkinType object must have a skinType as string',
    typeError_skinTypeCode: 'Product object has invalid type at property: skinTypeCode',
    incorrect_skinType: 'skinType field contain invalid value'
});


describe('Make skinType object', () => {

    test('object is created for skinType dry', ()=> {
        const skinType = makeSkinTypeObj(dummyData.valid_dry);
        
        expect(skinType.skinType).toBe('dry');
        expect(skinType.skinTypeCode).toBe('DR');
    }); 

    
    test('object is created for skinType normal', ()=> {
        const skinType = makeSkinTypeObj(dummyData.valid_normal);

        expect(skinType.skinType).toBe('normal');
        expect(skinType.skinTypeCode).toBe('NM');
    });

    test('object is created for skinType oily', ()=> {
        const skinType = makeSkinTypeObj(dummyData.valid_oily);

        expect(skinType.skinType).toBe('oily');
        expect(skinType.skinTypeCode).toBe('OL');
    }); 

    test('skinType object cannot have invalid input for skinType - dry', () => {
        const skinType = makeSkinTypeObj(dummyData.incorrect_name_dry);

        expect(skinType instanceof Error).toBe(true);
        expect(skinType.message).toBe(errorMessages.incorrect_skinType);
        expect(skinType.skinTypeCode).not.toBe('DR');
    });

    test('skinType object cannot have invalid input for skinType - normal', () => {
        const skinType = makeSkinTypeObj(dummyData.incorrect_name_normal);

        expect(skinType instanceof Error).toBe(true);
        expect(skinType.message).toBe(errorMessages.incorrect_skinType);
        expect(skinType.skinTypeCode).not.toBe('NM');
    });

    test('skinType object cannot have invalid input for skinType - oily', () => {
        const skinType = makeSkinTypeObj(dummyData.incorrect_name_oily);

        expect(skinType instanceof Error).toBe(true);
        expect(skinType.message).toBe(errorMessages.incorrect_skinType);
        expect(skinType.skinTypeCode).not.toBe('OL');
    });

    test('skinType object must retrieve correct skinTypeCode when initial input is invalid', () => {
        let payload = JSON.parse(JSON.stringify(dummyData.valid_dry));
        payload.skinTypeCode = 'wrong code';

        const skinType = makeSkinTypeObj(payload);
        expect(skinType.skinType).toBe('dry');
        expect(skinType.skinTypeCode).toBe('DR');
    });

});

describe('Type checking: skinType object', () => {
    
    test('skinType object must have skinType field', () => {
        const skinType = makeSkinTypeObj(dummyData.incomplete_name);

        expect(skinType instanceof Error).toBe(true);
        expect(skinType.message).toBe(errorMessages.typeError_skinType);
    });

    test('skinType field must be string', () => {
        const skinType = makeSkinTypeObj(dummyData.invalid_name_type);

        expect(skinType instanceof Error).toBe(true);
        expect(skinType.message).toBe(errorMessages.typeError_skinType);
    });

    test('skinTypeCode property must be string if exist', () => {
        let payload = JSON.parse(JSON.stringify(dummyData.valid_dry));
        payload.skinTypeCode = 102;

        const skinType = makeSkinTypeObj(payload);

        expect(skinType instanceof Error).toBe(true);
        expect(skinType.message).toBe(errorMessages.typeError_skinTypeCode);
    });

});