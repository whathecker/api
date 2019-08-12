module.exports = {
    convertAmountFormat: (amount) => {
        return parseInt(amount.split('.').join(''));
         
    },

    convertCurrencyFormat: (currency) => {
        let converted;
        (currency === 'euro')? converted = 'eur': null;
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

    getEndpointSecret: (env) => {
        let secret;
        if (env === "local" || env === "development") {
            secret = process.env.STRIPE_ENDPOINT_SECRET_TEST;
        }

        if (env === "production") {
            secret = process.env.STRIPE_ENDPOINT_SECRET_PROD
        }
        return secret;
    },
    
    retrieveApikey: () => {
        let apikey;
        if (process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'development') {
            apikey = process.env.STRIPE_APIKEY_TEST;
        }
        if (process.env.NODE_ENV === 'production') {
            apikey = process.env.STRIPE_APIKEY_PROD;
        }
        return apikey;
    }
}