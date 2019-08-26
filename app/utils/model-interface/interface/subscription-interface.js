const Subscription = require('../../../models/Subscription');

const subscriptionInterfaces = {};

/**
 * public method: createSubscriptionInstance
 * @param {Object} subscriptionDetail 
 * Object contain following fields: 
 * country, package (with id and quantity fields)
 * 
 * @param {String} user_id 
 * object_id of User instance associated with the Subscription instance to be created
 * 
 * @param {String} billing_id 
 * object_id of Billing instance associated with the Subscription instance to be created
 * 
 * Return: new instance of Subscription
 */

subscriptionInterfaces.createSubscriptionInstance = (subscriptionDetail, user_id, billing_id) => {

    if (!subscriptionDetail) {
        throw new Error('Missing argument: cannnot create Subscription instance without subscriptionDetail argument');
    }

    if (!user_id) {
        throw new Error('Missing argument: cannnot create Subscription instance without user_id argument');
    }

    if (!billing_id) {
        throw new Error('Missing argument: cannnot create Subscription instance without billing_id argument');
    }

    const currenctEnv = process.env.NODE_ENV;

    const subscription = new Subscription();
    const country = subscriptionDetail.country.toLowerCase();
    subscription.subscriptionId = subscription.createSubscriptionId(currenctEnv, country);
    const subscriptionItem = {
        itemId: subscriptionDetail.package.id,
        quantity: subscriptionDetail.package.quantity
    } 
    subscription.subscribedItems = [subscriptionItem];

    // user_id
    subscription.user = user_id;
    
    // billingOption._id
    subscription.paymentMethod = billing_id;
    
    return subscription;
}


/**
 * public method: addFirstDeliveryInfos
 * @param {Object} subscriptionInstance 
 * Instance of Subscription model to which add delivery into
 * 
 * @param {Object} deliveryDetail 
 * Object contain following fields:
 * deliveryFrequency, deliveryDay (refer to Subscription model for accetped values)
 * 
 * @param {Object} orderInstance 
 * Instance of Order model that are created under Subscription as first order
 * 
 * Return: extended instance of Subscription with deliveryInfos
 */

subscriptionInterfaces.addFirstDeliveryInfos = (subscriptionInstance, deliveryDetail, orderInstance) => {

    if (!subscriptionInstance) {
        throw new Error('Missing argument: subscriptionInstance');
    }

    if (!deliveryDetail) {
        throw new Error('Missing argument: deliveryDetail');
    }

    if (!orderInstance) {
        throw new Error('Missing argument: orderInstance argument');
    }

    subscriptionInstance.deliveryFrequency = deliveryDetail.deliveryFrequency;
    subscriptionInstance.deliveryDay =  deliveryDetail.deliveryDay;
    const firstDeliverySchedule = subscriptionInstance.setFirstDeliverySchedule(subscriptionInstance.deliveryDay, orderInstance.orderNumber);
    const nextDeliverySchedule = subscriptionInstance.setDeliverySchedule(firstDeliverySchedule.nextDeliveryDate, subscriptionInstance.deliveryFrequency, subscriptionInstance.deliveryDay);
    subscriptionInstance.deliverySchedules = [firstDeliverySchedule, nextDeliverySchedule];

    return subscriptionInstance;
}

/**
 * public method: addOrderInSubscription
 * @param {Object} subscriptionInstance 
 * Instance of Subscription model to which add Order Instance
 * 
 * @param {Object} orderInstance 
 * Instance of Order model to be added in Subscription model
 * 
 * Return: extended instance of Subscription with orders
 */

subscriptionInterfaces.addOrderInSubscription = (subscriptionInstance, orderInstance) => {
    
    if (!orderInstance) {
        throw new Error('Missing argument: orderInstance argument');
    }

    if (!subscriptionInstance) {
        throw new Error('Missing argument: subscriptionInstance argument');
    }

    subscriptionInstance.orders.push(orderInstance);

    return subscriptionInstance;
}

module.exports = subscriptionInterfaces;