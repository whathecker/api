const config = require('../../../../../../../../../configuration');

module.exports = {
    convertAmountFormat: (amount) => {
        const parsedNum = parseInt(amount.split('.').join(''));
        
        if (!Number.isInteger(parsedNum)) {
            throw new Error("invalid price format in the payload");
        } 
        return parsedNum;
    },

    convertCurrencyFormat: (currency) => {
        let converted;
        (currency === 'euro')? converted = 'eur': null;

        if (!converted ===  null || converted === undefined) {
            throw new Error("invalid currenct in the payload");
        }
        return converted;
    },

    isAddressesSame: (billingAddress, shippingAddress) => {
        let compareResult = true;
        for (let prop in shippingAddress) {
            if (shippingAddress[prop] !== billingAddress[prop]) {
                compareResult = false;
            }
        }
        return compareResult;
    },

    getEndpointSecret: () => {
        let secret;
        const env = process.env.NODE_ENV;

        if (env === "test" || env === "local" || env === "development") {
            secret = config.stripe.STRIPE_ENDPOINT_SECRET_TEST;
        }

        if (env === "production") {
            secret = config.stripe.STRIPE_ENDPOINT_SECRET_PROD;
        }
        return secret;
    },
    
    retrieveApikey: () => {
        let apikey;
        const env = process.env.NODE_ENV;

        if (env === "test" || env=== 'local' || env === 'development') {
            apikey = config.stripe.STRIPE_APIKEY_TEST;
        }
        
        if (env === 'production') {
            apikey = config.stripe.STRIPE_APIKEY_PROD;
        }
        return apikey;
    }
}