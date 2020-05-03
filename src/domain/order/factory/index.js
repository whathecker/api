const errors = require('../order-error');
const OrderBaseFactory = require('../../_shared/factory').order_base_factory;


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

class OrderFactory extends OrderBaseFactory{
    constructor({
        country,
        orderNumber,
        user_id,
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


        const result_order_status = OrderFactory.validateOrderStatus(orderStatus);
        if (!result_order_status) {
            return errors.genericErrors.invalid_order_status;
        }
        
        const result_order_status_history = OrderFactory.validateOrderStatusHistory(orderStatusHistory);
        if (!result_order_status_history) {
            return errors.genericErrors.invalid_order_status_in_history;
        }

        const result_payment_status = OrderFactory.validatePaymentStatus(paymentStatus);
        if (!result_payment_status) {
            return errors.genericErrors.invalid_payment_status;
        }

        const result_payment_status_history = OrderFactory.validatePaymentHistory(paymentHistory);
        if (!result_payment_status_history) {
            return errors.genericErrors.invalid_payment_status_in_history;
        }

        // only check the format of objects in OrderFactory

        // the construct of amountPerItem and totalAmount, create a separate object and delete gate it
        // therefore calculation of sumOfPrices of each item and setting Total amount is not required

        // however we do need to re-compute if given ammounts are correct and return error if not


        
        const result_orderAmountPerItem = OrderFactory.validateAmountPerItem(orderAmountPerItem);

        if (!result_orderAmountPerItem.success) {
            return OrderFactory.returnValidationErrorFromOrderAmountPerItem(result_orderAmountPerItem.error);
        }

        const result_shippedAmountPerItem = OrderFactory.validateAmountPerItem(shippedAmountPerItem);

        if (!result_shippedAmountPerItem.success) {
            return OrderFactory.returnValidationErrorFromShippedAmountPerItem(result_shippedAmountPerItem.error);
        }

        const result_orderAmount = OrderFactory.validateTotalAmount(orderAmount);

        if (!result_orderAmount.success) {
            return OrderFactory.returnValidationErrorFromOrderAmount(result_orderAmount.error);
        }

        const result_shippedAmount = OrderFactory.validateTotalAmount(shippedAmount);

        if (!result_shippedAmount.success) {
            return OrderFactory.returnValidationErrorFromShippedAmount(result_shippedAmount.error);
        }

        if (!orderNumber) {
            const payload = {
                envVar: process.env.NODE_ENV,
                country: country
            }
            orderNumber = OrderFactory.createOrderNumber(payload);
        }

        const payload = {
            country,
            orderNumber,
            user_id,
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
        };

        return new Order(payload);
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

    static validateAmountPerItem (amountPerItem) {
        let result = {
            success: true,
            error: null
        };

        for (let item of amountPerItem) {
            
            const result_currency = this.validate_currency(item.currency);

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
            const computed_grossPrice = this.calculate_price_delta(item.originalPrice, item.discount);

            if (computed_grossPrice !== item.grossPrice) {
                result = {
                    success: false,
                    error: 'grossPrice'
                };
                break;
            }

            const computed_netPrice = this.calculate_price_delta(item.grossPrice, item.vat);

            if (computed_netPrice !== item.netPrice) {
                result = {
                    success: false,
                    error: 'netPrice'
                }
                break;
            }

            const computed_sumOfGrossPrice = this.calculate_price_multiply_qty(item.grossPrice, item.quantity);

            if (computed_sumOfGrossPrice !== item.sumOfGrossPrice) {
                result = {
                    success: false,
                    error: 'sumOfGrossPrice'
                }
                break;
            }

            const computed_sumOfNetPrice = this.calculate_price_multiply_qty(item.netPrice, item.quantity);

            if (computed_sumOfNetPrice !== item.sumOfNetPrice) {
                result = {
                    success: false,
                    error: 'sumOfNetPrice'
                }
                break;
            }

            const computed_sumOfVat = this.calculate_price_multiply_qty(item.vat, item.quantity);

            if (computed_sumOfVat !== item.sumOfVat) {
                result = {
                    success: false,
                    error: 'sumOfVat'
                }
                break;
            }

            const computed_sumOfDiscount = this.calculate_price_multiply_qty(item.discount, item.quantity);

            if (computed_sumOfDiscount !== item.sumOfDiscount) {
                result = {
                    success: false,
                    error: 'sumOfDiscount'
                }
                break;
            }

        }

        return result;
    }

    

    static returnValidationErrorFromOrderAmountPerItem (errorType) {
        switch (errorType) {
            case 'currency':
                return errors.genericErrors.invalid_currency_in_orderAmountPerItem;
            case 'quantity':
                return errors.genericErrors.invalid_quantity_in_orderAmountPerItem;
            case 'grossPrice':
                return errors.genericErrors.invalid_gross_price_in_orderAmountPerItem;
            case 'netPrice':
                return errors.genericErrors.invalid_netPrice_in_orderAmountPerItem;
            case 'sumOfGrossPrice':
                return errors.genericErrors.invalid_sumOfGrossPrice_in_orderAmountPerItem;
            case 'sumOfNetPrice':
                return errors.genericErrors.invalid_sumOfNetPrice_in_orderAmountPerItem;
            case'sumOfVat':
                return errors.genericErrors.invalid_sumOfVat_in_orderAmountPerItem;
            case 'sumOfDiscount':
                return errors.genericErrors.invalid_sumOfDiscount_in_orderAmountPerItem;
            default: 
                throw new Error('unknown errorType: check your input');
        }
    }

    static returnValidationErrorFromShippedAmountPerItem (errorType) {
        switch (errorType) {
            case 'currency':
                return errors.genericErrors.invalid_currency_in_shippedAmountPerItem;
            case 'quantity':
                return errors.genericErrors.invalid_quantity_in_shippedAmountPerItem;
            case 'grossPrice':
                return errors.genericErrors.invalid_gross_price_in_shippedAmountPerItem;
            case 'netPrice':
                return errors.genericErrors.invalid_netPrice_in_shippedAmountPerItem;
            case 'sumOfGrossPrice':
                return errors.genericErrors.invalid_sumOfGrossPrice_in_shippedAmountPerItem;
            case 'sumOfNetPrice':
                return errors.genericErrors.invalid_sumOfNetPrice_in_shippedAmountPerItem;
            case'sumOfVat':
                return errors.genericErrors.invalid_sumOfVat_in_shippedAmountPerItem;
            case 'sumOfDiscount':
                return errors.genericErrors.invalid_sumOfDiscount_in_shippedAmountPerItem;
            default: 
                throw new Error('unknown errorType: check your input');
        }
    }

    static validateTotalAmount ({
        currency,
        totalAmount,
        totalDiscount,
        totalVat,
        totalNetPrice
    } = {}) {

        let result = {
            success: true,
            error: null
        };

        const result_currency = this.validate_currency(currency);

        if (!result_currency) {
            result.success = false;
            result.error = "currency";
            return result;
        }

        const computed_vat = this.calculate_price_delta(totalAmount, totalNetPrice);

        if (computed_vat !== totalVat) {
            result.success = false;
            result.error = "price";
            return result;
        }

        return result;
    }

    static returnValidationErrorFromOrderAmount (errorType) {
        switch (errorType) {
            case 'currency':
                return errors.genericErrors.invalid_currency_in_orderAmount;
            case 'price':
                return errors.genericErrors.invalid_price_in_orderAmount;
            default: 
                throw new Error('unknown errorType: check your input');
        }
    }

    static returnValidationErrorFromShippedAmount (errorType) {
        switch (errorType) {
            case 'currency':
                return errors.genericErrors.invalid_currency_in_shippedAmount;
            case 'price':
                return errors.genericErrors.invalid_price_in_shippedAmount;
            default: 
                throw new Error('unknown errorType: check your input');
        }
    }
}

class Order {
    constructor({
        country,
        orderNumber,
        user_id,
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

        this.country = country;
        this.orderNumber = orderNumber;
        this.user_id = user_id;
        this.orderStatus = orderStatus;
        this.orderStatusHistory = orderStatusHistory;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.paymentHistory = paymentHistory;
        this.orderAmountPerItem = orderAmountPerItem;
        this.orderAmount = orderAmount;
        this.shippedAmountPerItem = shippedAmountPerItem;
        this.shippedAmount = shippedAmount;

        (invoiceNumber)? this.invoiceNumber = invoiceNumber : null;
        (isSubscription)? this.isSubscription = isSubscription : null;
        (creationDate)? this.creationDate = creationDate : null;
        (deliverySchedule)? this.deliverySchedule = deliverySchedule : null;
        (isShipped)? this.isShipped = isShipped : null;
        (shippedDate)? this.shippedDate = shippedDate : null;
        (courier)? this.courier = courier : null;
        (trackingNumber)? this.trackingNumber = trackingNumber : null;
        (isConfEmailDelivered)? this.isConfEmailDelivered = isConfEmailDelivered : null;
        (lastModified)? this.lastModified = lastModified : null;
    }

    // set paymentStatus
    // set orderStatus
    // set order to shipped state (calls downsteam functions)
}

module.exports = OrderFactory;