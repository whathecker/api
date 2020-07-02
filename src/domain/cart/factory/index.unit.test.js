const CartFactory = require('./index');

describe('Test CheckoutFactory', () => {

    test('setDefaultCheckoutState must return ACTIVE', () => {
        const defaultState = CartFactory.setDefaultCheckoutState();
        expect(defaultState).toBe("ACTIVE");
    });

    test('validateCheckoutState must return true', () => {
        const result_active = CartFactory.validateCheckoutState("ACTIVE");
        const result_ordered = CartFactory.validateCheckoutState("ORDERED");
        const result_merged = CartFactory.validateCheckoutState("MERGED");

        expect(result_active).toBe(true);
        expect(result_ordered).toBe(true);
        expect(result_merged).toBe(true);
    });

    test('validateCheckoutState must return false', () => {
        const result = CartFactory.validateCheckoutState("active");
        const result2 = CartFactory.validateCheckoutState("inactive");
        const result3 = CartFactory.validateCheckoutState("order");
        
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
        for (let i = 0; i < 200; i++) {
            array.push(CartFactory.createAnnonymousId());
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

    test('validateShippingMethod must return true', () => {
        const result = CartFactory.validateShippingMethod("standard");
        
        expect(result).toBe(true);
    });

    test('validateShippingMethod must return false', () => {
        const result = CartFactory.validateShippingMethod("invalid");

        expect(result).toBe(false);
    });
});