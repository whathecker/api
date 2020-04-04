const enum_env_prefixes = Object.freeze({
    test: "DV",
    local: "DV",
    development: "DV",
    staging: "ST",
    production: "EC",
});

const enum_country_prefixes = Object.freeze({
    netherlands: "NL",
});

class OrderFacotry {
    constructor({

    } = {}) {

        // if orderNumber exist validateOrderNumberFormat
        // if no orderNumber create order number

        // if invoiceNumber exist validateInvoiceNumber

        // validateOrderStatus
        // validateOrderStatus in orderStatusHistory

        // validatePaymentStatus
        // validatePaymentStatus in paymentHistory

        

        // validate orderAmountPerItem

        // if orderAmount exist, validateOrderAmount with orderAmountPerItem
        // if orderAmount not exist, setOrderAmount


        // if shippedAmountPerItem exist, validateShippedAmount
        // if shippedAmount exist, validateShippedAmount against shippedAmountPerItem
        // if courier exist validateCourier
    }

    static validateOrderNumberFormat (orderNumber) {

        if (orderNumber.length !== 9) {
            return false;
        }

        const envPrefix = orderNumber.slice(0, 2);
        const resultEnvPrefix = this.validate_env_prefix(envPrefix);

        if (!resultEnvPrefix) {
            return false;
        }

        const countryPrefix = orderNumber.slice(2, 4);
        const resultCountryPrefix = this.validate_country_prefix(countryPrefix);
        
        if (!resultCountryPrefix) {
            return false;
        }

        return true;
    }

    static validate_env_prefix (envPrefix) {
        let result = false;

        for (let prop of Object.keys(enum_env_prefixes)) {
            if (envPrefix === enum_env_prefixes[prop]) {
                result = true;
                break;
            }
        }
        return result;
    }

    static validate_country_prefix (countryPrefix) {
        let result = false;

        for (let prop of Object.keys(enum_country_prefixes)) {
            if (countryPrefix === enum_country_prefixes[prop]) {
                result = true;
                break;
            }
        }
        return result;
    }

    static createOrderNumber () {

    }

    static validateInvoiceNumber () {

    }

    static validateOrderStatus () {

    }

    static validateOrderStatusHistory () {

    }

    static validatePaymentStatus () {

    }

    static validatePaymentHistory () {

    }
}

class Order {
    constructor({

    } = {}) {

    }

    // set paymentStatus
    // set orderStatus
    // set order to shipped state (calls downsteam functions)
}

module.exports = OrderFacotry;