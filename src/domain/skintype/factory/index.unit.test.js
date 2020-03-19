const SkinTypeFactory = require('./index');

describe('Test SkinTypeFactory', () => {

    test('validateSkinType must return false: invalid channel value', () => {
        const result = SkinTypeFactory.validateSkinType('dr');
        
        expect(result).toBe(false);
    });

    test('validateSkinType must return true', () => {
        const result = SkinTypeFactory.validateSkinType('dry');
        const result2 = SkinTypeFactory.validateSkinType('normal');
        const result3 = SkinTypeFactory.validateSkinType('oily');

        expect(result).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);
    });

});