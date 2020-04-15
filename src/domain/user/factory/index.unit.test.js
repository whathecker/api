const UserFactory = require('./index');

describe('Test UserFactory', ()=> {

    test('validateEmailAddress must return true', () => {
        const email = 'test@gmail.com';
        const email2 = 'test@naver.co.kr';
        const email3 = 'test@gmail.nl';

        const result = UserFactory.validateEmailAddress(email);
        const result2 = UserFactory.validateEmailAddress(email2);
        const result3 = UserFactory.validateEmailAddress(email3);

        expect(result).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);
    });

    test('validateEmailAddress must return false', () => {
        const email = 'testgmail.com';
        const email2 = 'test@naver';
        const email3 = 'testgmail';

        const result = UserFactory.validateEmailAddress(email);
        const result2 = UserFactory.validateEmailAddress(email2);
        const result3 = UserFactory.validateEmailAddress(email3);

        expect(result).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);
    });
});