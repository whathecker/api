const enum_channel = Object.freeze({
    0: 'EU'
});
const enum_region_in_price = Object.freeze({
    0: 'eu'
});
const enum_currency_in_price = Object.freeze({
    0: 'euro'
});
const enum_vat_rate = Object.freeze({
    eu: 0.21
});

class ProductBaseFactory {
    constructor() {

    }

    static validateChannel (channel) {
        let result = false;
        
        for (let prop of Object.keys(enum_channel)) {
            if (channel === enum_channel[prop]) {
                result = true;
                break;
            }
        }
        return result;
    }

    static validateRegionInPrice (region_in_price) {
        let result = false;

        for (let prop of Object.keys(enum_region_in_price)) {
            if (region_in_price === enum_region_in_price[prop]) {
                result = true;
                break;
            }
        }
        return result;
    }

    static validateCurrencyInPrice (currency_in_price) {
        let result = false;

        for (let prop of Object.keys(enum_currency_in_price)) {
            if (currency_in_price === enum_currency_in_price[prop]) {
                result = true;
                break;
            }
        }
        return result;
    }

    static validatePriceFormat (price) {
        let result =  false;

        const splittedPrice = price.split('.');

        if (splittedPrice.length !== 2) {
            return result;
        }

        const primeNum = Number(splittedPrice[0]);
        const floatingPoint = Number(splittedPrice[1]);

        (!Number.isNaN(primeNum) && !Number.isNaN(floatingPoint))?
            result = true : null;
        
        return result;
    }

    static isPriceZero (price) {
        let result = false;

        const splittedPrice = price.split('.');

        const primeNum = Number(splittedPrice[0]);
        const floatingPoint = Number(splittedPrice[1]);

        (primeNum === 0 && floatingPoint === 0)? 
            result = true : null;

        return result;
    }

    static correctPriceDigit (price) {
        return Number(price).toFixed(2);
    }

    static isVatExist (vat) {
        if (!vat) {
            return false;
        } 
        return true;
    }

    static isNetPriceExist (netPrice) {
        if (!netPrice) {
            return false;
        }
        return true;
    }

    static setVat (price, regionInPrice) {
        const priceInNum = Number(price).toFixed(2);
        const vatRate = enum_vat_rate[regionInPrice];

        let netPrice = priceInNum / (1 + vatRate);
        netPrice = netPrice.toFixed(2);

        let vat = priceInNum - netPrice;

        return vat.toFixed(2);
    }

    static setNetPrice (price, regionInPrice) {
        const priceInNum = Number(price).toFixed(2);
        const vatRate = enum_vat_rate[regionInPrice];

        let netPrice = priceInNum / (1 + vatRate);

        return netPrice.toFixed(2);
    }

    static isIdExist (id) {
        if (!id) {
            return false;
        }
        return true;
    }

    static createProductId () {
        throw new Error('Cannot call createProductId directly at parent class: implement this method');
    }

    static createSubscriptionBoxId () {
        throw new Error('Cannnot call createSubscriptionBoxId directly at parent class: implement this method');
    }

    static create_five_digits_integer () {
        const num = Math.floor(Math.random() * 90000) + 10000;
        return num.toString();
    }
}

module.exports = ProductBaseFactory;