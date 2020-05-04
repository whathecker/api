const buildSerializer = require('../../_shared/serializerBuilder');

const _mapOrders = (orders) => {
    let mappedOrders = [];

    orders.forEach(order => {
        mappedOrders.push(order);
    });

    return mappedOrders;
};

const _mapDeliverySchedules = (deliverySchedules) => {
    let mappedDeliverySchedules = [];

    if (deliverySchedules.length === 0) return mappedDeliverySchedules;

    deliverySchedules.forEach(deliverySchedule => {
        mappedDeliverySchedules.push(_serializeDeliveryScheduleObj(deliverySchedule));
    });

    return mappedDeliverySchedules;
};

const _serializeDeliveryScheduleObj = (deliverySchedule) => {
    return {
        orderNumber: deliverySchedule.orderNumber,
        nextDeliveryDate: deliverySchedule.nextDeliveryDate,
        year: deliverySchedule.year,
        month: deliverySchedule.month,
        date: deliverySchedule.date,
        day: deliverySchedule.day
    };
};

const _mapSubscribedItems = (items) => {
    let mappedSubscribedItems = [];

    if (items.length === 0) return mappedSubscribedItems;

    items.forEach(item => {
        mappedSubscribedItems.push(_serializeSubscribedItemObj(item));
    });

    return mappedSubscribedItems;
};

const _serializeSubscribedItemObj = (itemObj) => {
    return {
        itemId: itemObj.itemId,
        quantity: itemObj.quantity
    };
};

const _serializeSingleObjEntry = (subscription) => {
    return {
        _id: subscription._id,
        country: subscription.country,
        channel: subscription.channel,
        deliveryFrequency: subscription.deliveryFrequency,
        deliveryDay: subscription.deliveryDay,
        isWelcomeEmailSent: subscription.isWelcomeEmailSent,
        orders: _mapOrders(subscription.orders),
        isActive: subscription.isActive,
        deliverySchedules: (subscription.deliverySchedules)? _mapDeliverySchedules(subscription.deliverySchedules) : [],
        subscribedItems: (subscription.subscribedItems)? _mapSubscribedItems(subscription.subscribedItems) : [],
        subscriptionId: subscription.subscriptionId,
        user_id: subscription.user_id,
        paymentMethod_id: subscription.paymentMethod_id,
        endDate: (subscription.endDate)? subscription.endDate : null,
        creationDate: subscription.creationDate,
        lastModified: subscription.lastModified
    };
};

module.exports = buildSerializer(_serializeSingleObjEntry);