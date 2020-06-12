const enum_env_prefixes = Object.freeze({
    test: "DV",
    local: "DV",
    development: "DV",
    staging: "ST",
    production: "EC",
});

const enum_country_prefixes = Object.freeze({
    NL: "NL",
});

const enum_currency = Object.freeze({
    0: "euro"
});

class OrderBaseFactory {

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

    static create_five_digits_integer () {
        const num = Math.floor(Math.random() * 90000) + 10000;
        return num.toString();
    }

    static validate_currency (currency) {
        let result = false;

        for (let prop of Object.keys(enum_currency)) {
            if (currency === enum_currency[prop]) {
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

    static validate_qty_of_item (qty) {
        let result = false;
        (qty > 0)? result = true : null;
        return result;
    }

    static calculate_price_delta (priceA, priceB) {
        priceA = Number(priceA).toFixed(2);
        priceB = Number(priceB).toFixed(2);

        let computedDeltaPrice = priceA - priceB;

        return computedDeltaPrice.toFixed(2);
    }

    static calculate_price_multiply_qty (price, quantity) {
        price = Number(price);

        let computedPrice = price * quantity;

        return computedPrice.toFixed(2);
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

}

module.exports = OrderBaseFactory;