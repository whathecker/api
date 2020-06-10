const errors = require('../checkout-error');
const OrderBaseFactory = require('../../_shared/factory').order_base_factory;
const crypto = require('crypto');

const enum_checkout_state = Object.freeze({
    0: "ACTIVE",
    1: "ORDERED",
    2: "MERGED"
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
            checkoutState = CheckoutFactory.set_default_checkoutState();
        } else {
            const result_checkoutState = CheckoutFactory.validate_checkoutState(checkoutState);
            if (!result_checkoutState) {
                return errors.genericErrors.invalid_checkout_status;
            }
        }

        if (user_id && anonymous_id) {
            // nullify anonymous_id
            // or throw error? 
        }

        if (!user_id && !anonymous_id) {
            anonymous_id = CheckoutFactory.createAnnonymousId();
        }

        if (lineItems) {
            // validate lineItems
        }

        if (shippingInfo) {
            // validate shippingMethod?
            // validate currency and amount in price object?
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
        return "ACTIVE"
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