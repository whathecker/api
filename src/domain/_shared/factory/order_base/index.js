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
}

module.exports = OrderBaseFactory;