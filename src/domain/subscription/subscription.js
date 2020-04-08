let buildCreateSubscriptionObj = function(subscriptionValidator) {
    return ({
        channel,
        subscriptionId,
        creationDate,
        lastModified,
        deliveryFrequency,
        deliveryDay,
        isWelcomeEmailSent,
        user,
        paymentMethod,
        isActive,
        orders,
        subscribedItems,
        deliverySchedules,
        endDate
    } ={}) => {

        const payload = {
            channel,
            subscriptionId,
            creationDate,
            lastModified,
            deliveryFrequency,
            deliveryDay,
            isWelcomeEmailSent,
            user,
            paymentMethod,
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
        return 'create subscription object';
    }
}

module.exports = buildCreateSubscriptionObj;