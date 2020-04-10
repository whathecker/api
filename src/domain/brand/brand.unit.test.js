const buildCreateBrandObj = require('./brand');
const brandSchema = require('./brand-schema');
const validator = require('../_shared/validator')(brandSchema);
const makeBrandObj = buildCreateBrandObj(validator);

const dummyData = Object.freeze({
    valid: {
        brandName: 'Misha',
        brandCode: "MS"
    },
    invalid_code: {
        brandName: 'Misha',
        brandCode: 0
    },
    invalid_name: {
        brandName: true,
        brandCode: 'MS'
    },
    incomplete_code: {
        brandName: 'Misha'
    },
    incomplete_name: {
        brandCode: 'MS'
    }
});

const errorMessages = Object.freeze({
    brandCode: 'Brand object must have a brandCode as string',
    brandName: 'Brand object must have a brandName as string'
});

describe('Make brand object', () => {
    
    test('object is created', ()=> {
        const brand = makeBrandObj(dummyData.valid);
        expect(brand.brandName).toBe('Misha');
        expect(brand.brandCode).toBe('MS');
    }); 

    test('brandCode must be string', () => {
        const brand = makeBrandObj(dummyData.invalid_code);
        expect(brand instanceof Error).toBe(true);
        expect(brand.message).toBe(errorMessages.brandCode);
    });

    test('brandName must be string', () => {
        const brand = makeBrandObj(dummyData.invalid_name);
        expect(brand instanceof Error).toBe(true);
        expect(brand.message).toBe(errorMessages.brandName);
    });

    test('brand object must have brandCode', () => {
        const brand = makeBrandObj(dummyData.incomplete_code);
        expect(brand instanceof Error).toBe(true);
        expect(brand.message).toBe(errorMessages.brandCode);
    });

    test('brand object must have brandName', () => {
        const brand = makeBrandObj(dummyData.incomplete_name);
        expect(brand instanceof Error).toBe(true);
        expect(brand.message).toBe(errorMessages.brandName);
    });

});