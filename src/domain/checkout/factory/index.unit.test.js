const CheckoutFactory = require('./index');

describe('Test CheckoutFactory', () => {

    test('setDefaultCheckoutState must return ACTIVE', () => {
        const defaultState = CheckoutFactory.setDefaultCheckoutState();
        expect(defaultState).toBe("ACTIVE");
    });

    test('validateCheckoutState must return true', () => {
        const result_active = CheckoutFactory.validateCheckoutState("ACTIVE");
        const result_ordered = CheckoutFactory.validateCheckoutState("ORDERED");
        const result_merged = CheckoutFactory.validateCheckoutState("MERGED");

        expect(result_active).toBe(true);
        expect(result_ordered).toBe(true);
        expect(result_merged).toBe(true);
    });

    test('validateCheckoutState must return false', () => {
        const result = CheckoutFactory.validateCheckoutState("active");
        const result2 = CheckoutFactory.validateCheckoutState("inactive");
        const result3 = CheckoutFactory.validateCheckoutState("order");
        
        expect(result).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);
    });

    test('createAnnonymousId must return unique hash', () => {
        const annonymousIds = fillAnnoymousIdsToTest();
        const result = isAllElementUnique(annonymousIds);
    
        expect(result).toBe(true);
    });

    function fillAnnoymousIdsToTest () {
        let array = [];
        for (let i = 0; i < 5000; i++) {
            array.push(CheckoutFactory.createAnnonymousId());
        }
        return array;
    }

    function isAllElementUnique (array) {
        for (let i = 0; i < array.length - 1; i++) {
            for (let j = i + 1; j < array.length; j++) {
                if (array[i] === array[j]) {
                    return false;
                }
            }
        }
        return true;
    }
});