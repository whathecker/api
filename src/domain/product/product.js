const errors = require('./product-error');

let buildCreateProductObj = function (productValidator) {
    return ({
        channel,
        id,
        name,
        description,
        category,
        categoryCode,
        brand,
        brandCode,
        volume,
        skinType,
        creationDate,
        lastModified,
        eanCode,
        prices,
        inventory,
        inventoryHistory
    } ={}) => {

        const payload = {
            channel,
            id,
            name,
            description,
            category,
            categoryCode,
            brand,
            brandCode,
            volume,
            skinType,
            creationDate,
            lastModified,
            eanCode,
            prices,
            inventory,
            inventoryHistory
        };

        const result = productValidator(payload);

        if (result instanceof Error) {
            return result;
        }

        return new ProductFactory(payload);
    }
}



class ProductFactory {

    constructor({
        channel,
        id,
        name,
        description,
        category,
        categoryCode,
        brand,
        brandCode,
        volume,
        skinType,
        creationDate,
        lastModified,
        eanCode,
        prices,
        inventory,
        inventoryHistory
    } = {}) {

        //let payload = inputObj;
        
        let result_channel = ProductFactory.validateChannel(channel);
        if (!result_channel) {
            throw errors.genericErrors.invalid_channel;
        }
        
        let result_region_prices = ProductFactory.validateRegionInPrice(prices[0].region);
        if (!result_region_prices) {
            throw errors.genericErrors.invalid_region_in_price;
        }

        let result_currency_prices = ProductFactory.validateCurrencyInPrice(prices[0].currency);
        if (!result_currency_prices) {
            throw errors.genericErrors.invalid_currency_in_price;
        }

        let result_is_price_zero = ProductFactory.isPriceZero(prices[0].price); 
        if (result_is_price_zero) {
            throw errors.genericErrors.zero_price;
        } 

        let result_price_format = ProductFactory.validatePriceFormat(prices[0].price);
        if (!result_price_format) {
            // if result_price_format is false call correctPriceDigit
        }

        
        
        
        let result_is_vat_exist = ProductFactory.isVatExist(prices[0].vat);
        if (!result_is_vat_exist) {
            // if result_is_vat_exist is false call setVat
        }
        if (result_is_vat_exist) {
            let result_vat_format = ProductFactory.validatePriceFormat(prices[0].vat);
            if (!result_vat_format) {
                // call correctPriceDigit
            }
        }

        let result_is_net_price_exist = ProductFactory.isNetPriceExist(prices[0].netPrice);
        if (!result_is_net_price_exist) {
            // if result_is_net_price_exist is false call setNetPrice
        }

        if (result_is_net_price_exist) {
            let result_is_net_price_format = ProductFactory.validatePriceFormat(prices[0].netPrice);
            if (!result_is_net_price_format) {
                // call correctPriceDigit
            }
        }
        

        let result_is_product_id_exist = ProductFactory.isProductIdExist(id);
        if (!result_is_product_id_exist) {
            // call createProductId
        }


        const payload = {
            channel,
            id,
            name,
            description,
            category,
            categoryCode,
            brand,
            brandCode,
            volume,
            skinType,
            creationDate,
            lastModified,
            eanCode,
            prices,
            inventory,
            inventoryHistory
        };

        return new Product(payload);
    }


    static validateChannel () {

    }

    static validateRegionInPrice () {

    }

    static validateCurrencyInPrice () {

    }

    static validatePriceFormat () {

    }

    static isPriceZero () {

    }

    static correctPriceDigit () {

    }

    static isVatExist () {

    }

    static isNetPriceExist () {

    }

    static setVat () {

    }

    static setNetPrice () {

    }
    
    static isProductIdExist () {

    }

    static createProductId () {

    }    

}

class Product {
    constructor({
        channel,
        id,
        name,
        description,
        category,
        categoryCode,
        brand,
        brandCode,
        volume,
        skinType,
        creationDate,
        lastModified,
        eanCode,
        prices,
        inventory,
        inventoryHistory
    } = {}) {

        this.channel = channel;
        this.id = id;
        this.name = name;
        this.description = description;

        this.category = category;
        this.categoryCode = categoryCode;
        this.brand = brand;
        this.brandCode = brandCode;
        this.skinType = skinType;
        
        this.prices = prices;
        this.inventory = inventory;
        this.inventoryHistory = inventoryHistory;

        (volume)? this.volume = volume: null;
        (creationDate)? this.creationDate = creationDate: null;
        (lastModified)? this.lastModified = lastModified: null;
        (eanCode)? this.eanCode = eanCode: null;
    }
}

module.exports = buildCreateProductObj;