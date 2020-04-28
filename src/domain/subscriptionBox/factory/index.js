const errors = require('../subscriptionBox-error');
const ProductBaseFactory = require('../../_shared/factory').product_base_factory;

class SubscriptionBoxFactory extends ProductBaseFactory {
    constructor({
        channel,
        packageId,
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
        

        const result_is_package_id_exist = SubscriptionBoxFactory.isIdExist(packageId);
        if (!result_is_package_id_exist) {
            packageId = SubscriptionBoxFactory.createSubscriptionBoxId(boxTypeCode);
        }


        const payload = {
            channel,
            packageId,
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

    static createSubscriptionBoxId (boxTypeCode) {
        const randomFiveDigitsNum = this.create_five_digits_integer();
        let subscriptionBox = '';
        return subscriptionBox.concat('PK', boxTypeCode, randomFiveDigitsNum);
    }  
}

class SubscriptionBox {
    constructor({
        channel,
        packageId,
        name,
        boxType,
        boxTypeCode,
        items,
        prices,
        creationDate,
        lastModified
    } = {}) {

        this.channel = channel;
        this.packageId = packageId;
        this.name = name;
        this.boxType = boxType;
        this.boxTypeCode = boxTypeCode;
        this.prices = prices;

        (items)? this.items = items : null;
        (creationDate)? this.creationDate = creationDate : null;
        (lastModified)? this.lastModified = lastModified : null;
    }
}

module.exports = SubscriptionBoxFactory;