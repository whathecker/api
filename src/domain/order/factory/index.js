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

const enum_order_status = Object.freeze({
    0: "RECEIVED",
    1: "PENDING",
    2: "PAID",
    3: "SHIPPED",
    4: "CANCELLED",
    5: "OVERDUE"
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

    static createOrderNumber ({
        envPrefix,
        countryPrefix
    } = {}) {

        (envPrefix === null)? envPrefix = "DV" : null;
        (countryPrefix === null)? countryPrefix =  "NL" : null;

        const fiveDigitsNum = this.create_five_digits_integer();

        return ''.concat(envPrefix, countryPrefix,fiveDigitsNum);
    }

    static create_five_digits_integer () {
        const num = Math.floor(Math.random() * 90000) + 10000;
        return num.toString();
    }

    static get_env_prefix (envVar) {
        const envPrefix = enum_env_prefixes[envVar];
        
        if (!envPrefix) {
            return null;
        }
        if (envPrefix) {
            return envPrefix;
        }
    }

    static get_country_prefix (country) {
        const countryPrefix = enum_country_prefixes[country];

        if (!countryPrefix) {
            return null;
        }
        if (countryPrefix) {
            return countryPrefix;
        }
    }

    static validateInvoiceNumber (invoiceNumber) {
        if (invoiceNumber.length === 13) {
            return true;
        }
        return false;
    }

    static validateOrderStatus ({
        status,
        timestamp
    } = {}) {
        let result = false;

        for (let prop of Object.keys(enum_order_status)) {
            if (status === enum_order_status[prop]) {
                result = true;
                break;
            }
        }
        return result;
    }

    static validateOrderStatusHistory (orderStatusHistory) {

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