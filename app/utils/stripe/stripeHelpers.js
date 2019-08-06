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
            secret = 'whsec_ru7wHcteQ9hMXzixtiEqa5zgcWZXBz2F';
        }

        if (env === "production") {
            // add production secret
        }
        return secret;
    }
}