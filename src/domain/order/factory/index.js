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
});

const enum_currency = Object.freeze({
    0: "euro"
});

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

        // only check the format of objects in OrderFactory

        // the construct of amountPerItem and totalAmount, create a separate object and delete gate it
        // therefore calculation of sumOfPrices of each item and setting Total amount is not required

        // however we do need to re-compute if given ammounts are correct and return error if not


        // validateOrderAmountPerItem of orderItem
        const result_orderAmountPerItem = OrderFacotry.validateOrderAmountPerItem(orderAmountPerItem);

        if (!result_orderAmountPerItem.status) {
            return OrderFacotry.returnValidationErrorFromOrderAmountPerItem(result_orderAmountPerItem.error);
        }
        // validateShippedAmountPerItem 
        // validate orderAmount
        // validate shippedAmount

        

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
        let result = {
            success: true,
            error: null
        };

        for (let item of orderAmountPerItem) {
            
            const result_currency = this.validate_currency_of_item(item.currency);

            if (!result_currency) {
                result = {
                    success: false,
                    error: 'currency'
                };
                break;
            }

            const result_qty = this.validate_qty_of_item(item.quantity);

            if (!result_qty) {
                result = {
                    success: false,
                    error: 'quantity'
                };
                break;
            }
        }

        return result;
    }

    static validate_currency_of_item (currency) {
        let result = false;

        for (let prop of Object.keys(enum_currency)) {
            if (currency === enum_currency[prop]) {
                result = true;
                break;
            }
        }
        return result;
    }

    static validate_qty_of_item (qty) {
        let result = false;
        (qty > 0)? result = true : null;
        return result;
    }

    static returnValidationErrorFromOrderAmountPerItem (errorType) {
        switch (errorType) {
            case 'currency':
                return errors.genericErrors.invalid_currency_in_orderAmountPerItem;
            case 'quantity':
                return errors.genericErrors.invalid_quantity_in_orderAmountPerItem;
            default: 
                throw new Error('unknown errorType: can your input');
        }
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