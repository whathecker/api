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
            // add production secret
        }
        return secret;
    },
    
    retrieveApikey: (env) => {
        let apikey;
        if (env === 'local' || env === 'development') {
            apikey = process.env.STRIPE_APIKEY_TEST;
        }
        if (env === 'production') {
            apikey = process.env.STRIPE_APIKEY_PROD;
        }
        return apikey;
    }
}