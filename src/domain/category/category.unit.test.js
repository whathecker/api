const buildCreateCategoryObj = require('./category');
const categorySchema = require('./category-schema');
const validator = require('../_shared/validator')(categorySchema);
const makeCategoryObj = buildCreateCategoryObj(validator);


const dummyData = Object.freeze({
    valid: {
        categoryName: 'Sheetmask',
        categoryCode: "ST"
    },
    invalid_code: {
        categoryName: 'Misha',
        categoryCode: 0
    },
    invalid_name: {
        categoryName: true,
        categoryCode: 'MS'
    },
    incomplete_code: {
        categoryName: 'Some category'
    },
    incomplete_name: {
        categoryCode: 'MS'
    }
});

const errorMessages = Object.freeze({
    categoryName: 'Category object must have a categoryName as string',
    categoryCode: 'Category object must have a categoryCode as string'
});

describe('Make category object', () => {

    test('object is created', ()=> {
        const category = makeCategoryObj(dummyData.valid);
        expect(category.categoryName).toBe('Sheetmask');
        expect(category.categoryCode).toBe('ST');
    }); 

    test('categoryCode must be string', () => {
        const category = makeCategoryObj(dummyData.invalid_code);
        expect(category instanceof Error).toBe(true);
        expect(category.message).toBe(errorMessages.categoryCode);
    });

    test('categoryName must be string', () => {
        const category = makeCategoryObj(dummyData.invalid_name);
        expect(category instanceof Error).toBe(true);
        expect(category.message).toBe(errorMessages.categoryName);
    });

    test('category object must have categoryCode', () => {
        const category = makeCategoryObj(dummyData.incomplete_code);
        expect(category instanceof Error).toBe(true);
        expect(category.message).toBe(errorMessages.categoryCode);
    });

    test('category object must have categoryName', () => {
        const category = makeCategoryObj(dummyData.incomplete_name);
        expect(category instanceof Error).toBe(true);
        expect(category.message).toBe(errorMessages.categoryName);
    });
});