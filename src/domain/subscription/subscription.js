const SubscriptionFactory = require('./factory');

let buildCreateSubscriptionObj = function(subscriptionValidator) {
    return ({
        country,
        channel,
        subscriptionId,
        creationDate,
        lastModified,
        deliveryFrequency,
        deliveryDay,
        isWelcomeEmailSent,
        user_id,
        paymentMethod_id,
        isActive,
        orders,
        subscribedItems,
        deliverySchedules,
        endDate
    } ={}) => {

        const payload = {
            country,
            channel,
            subscriptionId,
            creationDate,
            lastModified,
            deliveryFrequency,
            deliveryDay,
            isWelcomeEmailSent,
            user_id,
            paymentMethod_id,
            isActive,
            orders,
            subscribedItems,
            deliverySchedules,
            endDate
        };

        const result = subscriptionValidator(payload);

        if (result instanceof Error) {
            return result;
        }
        return new SubscriptionFactory(payload);
    }
}

module.exports = buildCreateSubscriptionObj;