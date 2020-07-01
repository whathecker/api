const errors = require('../checkout-error');
const OrderBaseFactory = require('../../_shared/factory').order_base_factory;
const crypto = require('crypto');

const enum_checkout_state = Object.freeze({
    0: "ACTIVE",
    1: "ORDERED",
    2: "MERGED"
});

const enum_shipping_method = Object.freeze({
    0: "standard"
});

class CheckoutFactory extends OrderBaseFactory {
    constructor({
        country,
        checkoutState,
        user_id,
        anonymous_id,
        isSubscription,
        lineItems,
        totalPrice,
        billingAddress,
        shippingAddress,
        shippingInfo,
        paymentInfo
    } = {}) {

        if (!checkoutState) {
            checkoutState = CheckoutFactory.setDefaultCheckoutState();
        } else {
            const result_checkoutState = CheckoutFactory.validateCheckoutState(checkoutState);
            if (!result_checkoutState) {
                return errors.genericErrors.invalid_checkout_status;
            }
        }

        if (user_id && anonymous_id) {
            return errors.genericErrors.conflict_ownership;
        }

        if (!user_id && !anonymous_id) {
            anonymous_id = CheckoutFactory.createAnnonymousId();
        }

        if (lineItems) {
            const result_lineItems = CheckoutFactory.validateAmountPerItem(lineItems);

            if (!result_lineItems.success) {
                return CheckoutFactory.returnValidationErrorFromLineItems(result_lineItems.error);
            }
        }

        if (shippingInfo) {

            const result_shippingMethod = CheckoutFactory.validateShippingMethod(shippingInfo.shippingMethod);

            if (!result_shippingMethod) {
                return errors.genericErrors.invalid_shippingMethod;
            }
            
            const result_currency_in_price = CheckoutFactory.validate_currency(shippingInfo.price.currency);

            if (!result_currency_in_price) {
                return errors.genericErrors.invalid_currency_in_shippingPrice;
            }

            const result_priceFormat_in_price = CheckoutFactory.validatePriceFormat(shippingInfo.price.amount);

            if (!result_priceFormat_in_price) {
                return errors.genericErrors.invalid_priceFormat_in_shippingPrice;
            }
        }
    
        const payload = {
            country,
            checkoutState,
            user_id,
            anonymous_id,
            isSubscription,
            lineItems,
            totalPrice,
            billingAddress,
            shippingAddress,
            shippingInfo,
            paymentInfo
        };
        return new Checkout(payload);
    }

    static setDefaultCheckoutState () {
        return "ACTIVE";
    }

    static validateCheckoutState (state) {
        let result = false;

        for (let prop of Object.keys(enum_checkout_state)) {
            if (state === enum_checkout_state[prop]) {
                result = true;
                break;
            }
        }
        return result;
    }

    static createAnnonymousId () {
        const date = Date.now().toString();
        const random_5_digit_num = this.create_five_digits_integer().toString();
        const secret = date.concat(random_5_digit_num);
        const hash = crypto.createHmac('sha256', secret);
        return hash.digest('hex').slice(20);
    }

    static returnValidationErrorFromLineItems (errorType) {
        switch (errorType) {
            case 'currency':
                return errors.genericErrors.invalid_currency_in_lineItems;
            case 'quantity':
                return errors.genericErrors.invalid_quantity_in_lineItems;
            case 'grossPrice':
                return errors.genericErrors.invalid_grossPrice_in_lineItems;
            case 'netPrice':
                return errors.genericErrors.invalid_netPrice_in_lineItems;
            case 'sumOfGrossPrice':
                return errors.genericErrors.invalid_sumOfGrossPrice_in_lineItems;
            case 'sumOfNetPrice':
                return errors.genericErrors.invalid_sumOfNetPrice_in_lineItems;
            case'sumOfVat':
                return errors.genericErrors.invalid_sumOfVat_in_lineItems;
            case 'sumOfDiscount':
                return errors.genericErrors.invalid_sumOfDiscount_in_lineItems;
            default: 
                throw new Error('unknown errorType: check your input');
        }
    }

    static validateShippingMethod (shippingMethod) {
        let result = false;

        for (let prop of Object.keys(enum_shipping_method)) {
            if (shippingMethod === enum_shipping_method[prop]) {
                result = true;
                break;
            }
        }
        return result;
    }
}

class Checkout {
    constructor({
        country,
        checkoutState,
        user_id,
        anonymous_id,
        isSubscription,
        lineItems,
        totalPrice,
        billingAddress,
        shippingAddress,
        shippingInfo,
        paymentInfo
    } ={}) {

        this.country = country;
        this.checkoutState = checkoutState;
        
        (user_id)? this.user_id = user_id : null;
        (anonymous_id)? this.anonymous_id = anonymous_id : null;
        (isSubscription)? this.isSubscription = isSubscription : null;
        (lineItems)? this.lineItems = lineItems : null;
        (totalPrice)? this.totalPrice = totalPrice : null;
        (billingAddress)? this.billingAddress = billingAddress : null;
        (shippingAddress)? this.shippingAddress = shippingAddress : null;
        (shippingInfo)? this.shippingInfo = shippingInfo : null;
        (paymentInfo)? this.paymentInfo = paymentInfo : null;
    }
}


module.exports = CheckoutFactory;