const errors = require('../order-error');

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

const enum_payment_status = Object.freeze({
    0: "OPEN",
    1: "AUTHORIZED",
    2: "PENDING",
    3: "REFUSED",
    4: "CANCELLED",
    5: "REFUNDED"
})

class OrderFacotry {
    constructor({
        orderNumber,
        user,
        invoiceNumber,
        isSubscription,
        orderStatus,
        orderStatusHistory,
        paymentMethod,
        paymentStatus,
        paymentHistory,
        creationDate,
        deliverySchedule,
        isShipped,
        shippedDate,
        courier,
        trackingNumber,
        isConfEmailDelivered,
        lastModified,
        orderAmountPerItem,
        orderAmount,
        shippedAmountPerItem,
        shippedAmount
    } = {}) {


        /*
        if (!orderNumber) {
            const country = "netherlands"; // technical debt: make it dynamic

            orderNumber = OrderFacotry.createOrderNumber({
                envVar: process.env.NODE_ENV,
                country: country
            });

            console.log(orderNumber);
        } */

        // if no orderNumber create order number

        

        
        const result_order_status = OrderFacotry.validateOrderStatus(orderStatus);
        if (!result_order_status) {
            return errors.genericErrors.invalid_order_status;
        }
        
        const result_order_status_history = OrderFacotry.validateOrderStatusHistory(orderStatusHistory);
        if (!result_order_status_history) {
            return errors.genericErrors.invalid_order_status_in_history;
        }

        const result_payment_status = OrderFacotry.validatePaymentStatus(paymentStatus);
        if (!result_payment_status) {
            return errors.genericErrors.invalid_payment_status;
        }

        const result_payment_status_history = OrderFacotry.validatePaymentHistory(paymentHistory);
        if (!result_payment_status_history) {
            return errors.genericErrors.invalid_payment_status_in_history;
        }

        

        // validatePriceFormat of orderItem

        // validate orderAmountPerItem
        // check if grossPrice is correct
        // check if VAT is correct
        // check if netPrice is correct
        // check if sumOfDiscount is correct
        // check if sumOfVat is correct
        // check if sumOfGrossPrice is correct
        // check if sumOfNetPrice is correct

        // if orderAmount exist, validateOrderAmount with orderAmountPerItem
        // if orderAmount not exist, setOrderAmount


        // if shippedAmountPerItem exist, validateShippedAmount
        // if shippedAmount exist, validateShippedAmount against shippedAmountPerItem
        // if courier exist validateCourier
    }

    static validateOrderNumberFormat (orderNumber) {

        if (orderNumber.length !== 14) {
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
        envVar,
        country
    } = {}) {
        let envPrefix  = this.get_env_prefix(envVar);
        let countryPrefix = this.get_country_prefix(country);

        (envPrefix === null)? envPrefix = "DV" : null;
        (countryPrefix === null)? countryPrefix =  "NL" : null;

        const fiveDigitsNum = this.create_five_digits_integer();
        const fiveDigitsNum2 = this.create_five_digits_integer();

        return ''.concat(envPrefix, countryPrefix,fiveDigitsNum, fiveDigitsNum2);
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
        let result = true;

        for (let orderStatus of orderStatusHistory) {
            const validation_result = this.validateOrderStatus(orderStatus);
            if (!validation_result) {
                result = false;
                break;
            }
        }
        return result;
    }

    static validatePaymentStatus ({
        status,
        timestamp
    } = {}) {
        let result = false;

        for (let prop of Object.keys(enum_payment_status)) {
            if (status === enum_payment_status[prop]) {
                result = true;
                break;
            }
        }
        return result;
    }

    static validatePaymentHistory (paymentHistory) {
        let result = true;

        for (let paymentStatus of paymentHistory) {
            const validation_result = this.validatePaymentStatus(paymentStatus);
            if (!validation_result) {
                result = false;
                break;
            }
        }
        return result;
    }

    static validateOrderAmountPerItem (orderAmountPerItem) {

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