const errors = require('../product-error');
const ProductBaseFactory = require('../../__shared_factory').product_base_factory;

class ProductFactory extends ProductBaseFactory {
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

        const result_channel = ProductFactory.validateChannel(channel);
        if (!result_channel) {
            return errors.genericErrors.invalid_channel;
        }
        
        const result_region_prices = ProductFactory.validateRegionInPrice(prices[0].region);
        if (!result_region_prices) {
            return errors.genericErrors.invalid_region_in_price;
        }

        const result_currency_prices = ProductFactory.validateCurrencyInPrice(prices[0].currency);
        if (!result_currency_prices) {
            return errors.genericErrors.invalid_currency_in_price;
        }

        

        const result_price_format = ProductFactory.validatePriceFormat(prices[0].price);
        if (!result_price_format) {
            prices[0].price = ProductFactory.correctPriceDigit(prices[0].price);
        }
        
        const result_is_price_zero = ProductFactory.isPriceZero(prices[0].price); 
        if (result_is_price_zero) {
            return errors.genericErrors.zero_price;
        } 

        
        
        
        const result_is_vat_exist = ProductFactory.isVatExist(prices[0].vat);
        if (!result_is_vat_exist) {
            prices[0].vat = ProductFactory.setVat(prices[0].price, prices[0].region);
        } 
        
        if (result_is_vat_exist) {
            const result_vat_format = ProductFactory.validatePriceFormat(prices[0].vat);
            
            if (!result_vat_format) {
                prices[0].vat = ProductFactory.correctPriceDigit(prices[0].vat);
            }
        }


        const result_is_net_price_exist = ProductFactory.isNetPriceExist(prices[0].netPrice);
        if (!result_is_net_price_exist) {
            prices[0].netPrice = ProductFactory.setNetPrice(prices[0].price, prices[0].region);
        }
        
        if (result_is_net_price_exist) {
            const result_is_net_price_format = ProductFactory.validatePriceFormat(prices[0].netPrice);
            
            if (!result_is_net_price_format) {
                prices[0].netPrice = ProductFactory.correctPriceDigit(prices[0].netPrice);
            }
        }
        

        const result_is_product_id_exist = ProductFactory.isProductIdExist(id);
        if (!result_is_product_id_exist) {
            id = ProductFactory.createProductId(brandCode, categoryCode);
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

    static createProductId (brandCode, categoryCode) {
        const randomFiveDigitsNum = this.create_five_digits_integer();
        let productId = '';
        return productId.concat(brandCode, categoryCode, randomFiveDigitsNum);
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

module.exports = ProductFactory;