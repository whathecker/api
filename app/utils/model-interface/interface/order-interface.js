const Order = require('../../../models/Order');

const orderInterfaces = {};

/**
 * public method: createOrderInstance
 * @param {String} country 
 * country field of which order is created
 * 
 * @param {Boolean} isSubscription 
 * true when order is created under subscription, otherwise false
 * 
 * @param {String} user_id 
 * object_id of User instance associated with the Order instance to be created
 * 
 * Return: new instance of Order
 */

orderInterfaces.createOrderInstance = (country, isSubscription, user_id) => {
    
    if (!country) {
        throw new Error('Missing argument: cannnot create Order instance without country argument');
    }

    if (!isSubscription) {
        throw new Error('Missing argument: cannnot create Order instance without isSubscription argument');
    }

    if (!user_id) {
        throw new Error('Missing argument: cannnot create Order instance without user_id argument');
    }

    const currentEnv = process.env.NODE_ENV;
    country = country.toLowerCase();

    const order = new Order();
    order.orderNumber = order.createOrderNumber(currentEnv, country);
    order.invoiceNumber = order.createInvoiceNumber();
    order.isSubscription = isSubscription;
    order.user = user_id;

    return order
}

/**
 * public method: addItemDetail
 * @param {Object} orderInstance 
 * instance of Order model to add item detail
 * 
 * @param {Object} itemDetail 
 * object contain following fields:
 * id, name, quantity, prices (Array contain object with price, vat, netPrice, currency)
 * 
 * Return: extended instance of Order with itemDetails
 */

orderInterfaces.addItemDetail = (orderInstance, itemDetail) => {

    if (!orderInstance) {
        throw new Error('Missing argument: orderInstance');
    }

    if (!itemDetail) {
        throw new Error('Missing argument: itemDetail');
    }

    const itemAmount = {
        itemId: itemDetail.id,
        name: itemDetail.name,
        quantity: itemDetail.quantity,
        currency: "euro",
        originalPrice: itemDetail.prices[0].price,
        vat: itemDetail.prices[0].vat,
        grossPrice: itemDetail.prices[0].price,
        netPrice: itemDetail.prices[0].netPrice,
        sumOfVat: orderInstance.setSumOfItemPrice(itemDetail.prices[0].vat, itemDetail.quantity),
        sumOfGrossPrice: orderInstance.setSumOfItemPrice(itemDetail.prices[0].price, itemDetail.quantity),
        sumOfNetPrice: orderInstance.setSumOfItemPrice(itemDetail.prices[0].netPrice, itemDetail.quantity)
    }

    orderInstance.orderAmountPerItem = [itemAmount];
    orderInstance.orderAmount = orderInstance.setTotalAmount(orderInstance.orderAmountPerItem, 'euro');

    return orderInstance;

}

/**
 * public method: addBillingInfo
 * @param {Object} orderInstance 
 * instance of Order model to add item detail
 * 
 * @param {Object} billingInstance 
 * instance of Billing model associated with Order instace
 * 
 * 
 * @param {String} stripe_payment_method 
 * unique_id representing payment_method created with Stripe
 * 
 * Return: extended instance of Order with billingInfos
 */

orderInterfaces.addBillingInfo = (orderInstance, billingInstance, stripe_payment_method) => {
    
    if (!orderInstance) {
        throw new Error('Missing argument: orderInstance');
    }

    if (!billingInstance) {
        throw new Error('Missing argument: billingInstance');
    }

    if (!stripe_payment_method) {
        throw new Error('Missing argument: stripe_payment_method');
    }

    orderInstance.paymentMethod = {
        type: billingInstance.type,
        recurringDetail: stripe_payment_method /** adyen field - not used in Stripe */
    }

    return orderInstance;
}

/**
 * public method: updateAuthStatusOfFirstOrder
 * @param {Object} orderInstance 
 * instance of Order model to add item detail
 * 
 * Return: extended instance of Order with orderStatus, paymentStatus
 * 
 * This method should only be used for first order just created
 */

orderInterfaces.updateAuthStatusOfFirstOrder = (orderInstance) => {

    if (!orderInstance) {
        throw new Error('Missing argument: orderInstance');
    }

    const firstPaymentStatus = { status: 'OPEN', timestamp: Date.now()};
    const firstOrderStatus = { status: 'RECEIVED', timestamp: Date.now()};
    orderInstance.paymentStatus = { status: 'AUTHORIZED', timestamp: Date.now()};
    orderInstance.orderStatus = { status: 'PAID', timestamp: Date.now()};
    orderInstance.paymentHistory = [firstPaymentStatus, orderInstance.paymentStatus];
    orderInstance.orderStatusHistory = [firstOrderStatus, orderInstance.orderStatus];

    return orderInstance;
}

module.exports = orderInterfaces;