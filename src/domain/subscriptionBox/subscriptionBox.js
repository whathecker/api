const SubscriptionBoxFactory = require('./factory');

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

module.exports = buildCreateSubscriptionBoxObj;