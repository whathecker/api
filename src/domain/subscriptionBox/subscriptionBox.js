const errors = require('./subscriptionBox-error');

let buildCreateSubscriptionBoxObj = function (subscriptionBoxValidator) {
    return ({
        channel,
        id,
        name,
        boxType,
        boxTypeCode,
        items,
        prices,
        creationDate,
        lastModified
    } = {}) => {

        const payload = {
            channel,
            id,
            name,
            boxType,
            boxTypeCode,
            items,
            prices,
            creationDate,
            lastModified
        };

        const result = subscriptionBoxValidator(payload);

        if (result instanceof Error) {
            return result;
        }
        
        return new SubscriptionBoxFactory(payload);
    }
}

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

class SubscriptionBoxFactory {
    constructor({
        channel,
        id,
        name,
        boxType,
        boxTypeCode,
        items,
        prices,
        creationDate,
        lastModified
    } = {}) {

        const result_channel = SubscriptionBoxFactory.validateChannel(channel);
        if (!result_channel) {
            return errors.genericErrors.invalid_channel;
        }

        const result_region_prices = SubscriptionBoxFactory.validateRegionInPrice(prices[0].region);
        if (!result_region_prices) {
            return errors.genericErrors.invalid_region_in_price;
        }

        const result_currency_prices = SubscriptionBoxFactory.validateCurrencyInPrice(prices[0].currency);
        if (!result_currency_prices) {
            return errors.genericErrors.invalid_currency_in_price;
        }

        const result_price_format = SubscriptionBoxFactory.validatePriceFormat(prices[0].price);
        if(!result_price_format) {
            prices[0].price = SubscriptionBoxFactory.correctPriceDigit(prices[0].price);
        }

        const result_is_price_zero = SubscriptionBoxFactory.isPriceZero(prices[0].price);
        if (result_is_price_zero) {
            return errors.genericErrors.zero_price;
        }

        const result_is_vat_exist = SubscriptionBoxFactory.isVatExist(prices[0].vat);
        if (!result_is_vat_exist) {
            prices[0].vat = SubscriptionBoxFactory.setVat(prices[0].price, prices[0].region);
        } 
        
        if (result_is_vat_exist) {
            const result_vat_format = SubscriptionBoxFactory.validatePriceFormat(prices[0].vat);
            
            if (!result_vat_format) {
                prices[0].vat = SubscriptionBoxFactory.correctPriceDigit(prices[0].vat);
            }
        }


        const result_is_net_price_exist = SubscriptionBoxFactory.isNetPriceExist(prices[0].netPrice);
        if (!result_is_net_price_exist) {
            prices[0].netPrice = SubscriptionBoxFactory.setNetPrice(prices[0].price, prices[0].region);
        }
        
        if (result_is_net_price_exist) {
            const result_is_net_price_format = SubscriptionBoxFactory.validatePriceFormat(prices[0].netPrice);
            
            if (!result_is_net_price_format) {
                prices[0].netPrice = SubscriptionBoxFactory.correctPriceDigit(prices[0].netPrice);
            }
        }
        

        const result_is_product_id_exist = SubscriptionBoxFactory.isProductIdExist(id);
        if (!result_is_product_id_exist) {
            id = SubscriptionBoxFactory.createSubscriptionBoxId(boxTypeCode);
        }


        const payload = {
            channel,
            id,
            name,
            boxType,
            boxTypeCode,
            items,
            prices,
            creationDate,
            lastModified
        };

        return new SubscriptionBox(payload);
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
    
    static isProductIdExist (id) {
        if (!id) {
            return false;
        }
        return true;
    }

    static createSubscriptionBoxId (boxTypeCode) {
        const randomFiveDigitsNum = this.create_five_digits_integer();
        let subscriptionBox = '';
        return subscriptionBox.concat('PK', boxTypeCode, randomFiveDigitsNum);
    }    

    static create_five_digits_integer () {
        const num = Math.floor(Math.random() * 90000) + 10000;
        return num.toString();
    }
}

class SubscriptionBox {
    constructor({
        channel,
        id,
        name,
        boxType,
        boxTypeCode,
        items,
        prices,
        creationDate,
        lastModified
    } = {}) {

        this.channel = channel;
        this.id = id;
        this.name = name;
        this.boxType = boxType;
        this.boxTypeCode = boxTypeCode;
        this.prices = prices;

        (items)? this.items = items : null;
        (creationDate)? this.creationDate = creationDate : null;
        (lastModified)? this.lastModified = lastModified : null;
    }
}

module.exports = buildCreateSubscriptionBoxObj;