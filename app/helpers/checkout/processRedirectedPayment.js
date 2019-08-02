const User = require('../../models/User');
const Address = require('../../models/Address');
const Billing = require('../../models/Billing');
const Subscription = require('../../models/Subscription');
const Order = require('../../models/Order');
const crypto = require('crypto');
const logger = require('../../utils/logger');
const adyenAxios = require('../../../axios-adyen');
const axiosSendGrid = require('../../../axios-sendgrid');
const errorDispatchers = require('../../utils/errorDispatchers/errorDispatchers');


function isAddressesSame (billingAddress, shippingAddress) {
    let compareResult = true;
    for (let prop in shippingAddress) {
        if (shippingAddress[prop] !== billingAddress[prop]) {
            compareResult = false;
        }
    }
    return compareResult;
}

function processRedirectedPayment (req, res, next) {

    if (!req.body.details) {
        return res.status(400).json({
            status: res.status,
            message: 'bad request',
        });
    }
    //console.log(req.body);
    console.log(req.body.userId);
    const payloadForUser = req.body.user;
    const payloadPackage = req.body.package;
    let paidBy = null;
    const payloadToAdyen = {
        details: req.body.details
    }

    

    // construct new new user
    let newUser = new User();
    //console.log(newUser);
    newUser.email = payloadForUser.email;
    newUser.userId = req.body.userId; /** user userId created from first call at /payments */
    newUser.salt = crypto.randomBytes(64).toString('hex');
    newUser.hash = newUser.setPassword(newUser, payloadForUser.password);
    newUser.firstName = payloadForUser.firstName;
    newUser.lastName = payloadForUser.lastName;
    newUser.mobileNumber = payloadForUser.mobileNumber;
    newUser.newsletterOptin = payloadForUser.newsletterOptin;

    const addressComparison = isAddressesSame(payloadForUser.billingAddress, payloadForUser.shippingAddress);
    
    // construct new billing addresses
    let billingAddress = new Address();
    billingAddress.firstName = payloadForUser.billingAddress.firstName;
    billingAddress.lastName = payloadForUser.billingAddress.lastName;
    billingAddress.postalCode = payloadForUser.billingAddress.postalCode;
    billingAddress.houseNumber = payloadForUser.billingAddress.houseNumber;
    billingAddress.houseNumberAdd = payloadForUser.billingAddress.houseNumberAdd;
    billingAddress.mobileNumber = payloadForUser.billingAddress.mobileNumber;
    billingAddress.streetName = payloadForUser.billingAddress.streetName;
    billingAddress.city = payloadForUser.billingAddress.city;
    billingAddress.province = payloadForUser.billingAddress.province;
    billingAddress.country = payloadForUser.billingAddress.country;
    billingAddress.user = newUser._id;

    // construct new shipping addresses
    let shippingAddress = new Address();
    shippingAddress.firstName = payloadForUser.shippingAddress.firstName;
    shippingAddress.lastName = payloadForUser.shippingAddress.lastName;
    shippingAddress.postalCode = payloadForUser.shippingAddress.postalCode;
    shippingAddress.houseNumber = payloadForUser.shippingAddress.houseNumber;
    shippingAddress.houseNumberAdd = payloadForUser.shippingAddress.houseNumberAdd;
    shippingAddress.mobileNumber = payloadForUser.shippingAddress.mobileNumber;
    shippingAddress.streetName = payloadForUser.shippingAddress.streetName;
    shippingAddress.city = payloadForUser.shippingAddress.city;
    shippingAddress.province = payloadForUser.shippingAddress.province;
    shippingAddress.country = payloadForUser.shippingAddress.country;
    shippingAddress.user = newUser._id;

    // construct new billing option
    let billingOption = new Billing();
    billingOption.user = newUser._id;
    billingOption.type = null; /* updated later from response of Adyen */
    billingOption.billingId = billingOption.setBillingId();
    
    // construct new subscription
    const currentEnv = process.env.NODE_ENV;
    let subscription = new Subscription();
    const countryInLowerCase = payloadForUser.shippingAddress.country.toLowerCase();
    subscription.subscriptionId = subscription.createSubscriptionId(currentEnv, countryInLowerCase);

    const subscriptionItem = {
        itemId: payloadPackage.id,
        quantity: 1
    }
    subscription.subscribedItems = [subscriptionItem];
    subscription.user = newUser._id;
    subscription.paymentMethod = billingOption._id;

    // construct first order of customer
    let order = new Order();
    order.orderNumber = null; /* updated later from response of Adyen */
    order.invoiceNumber = order.createInvoiceNumber();
    order.isSubscription = true; 

    const itemAmount = {
        itemId: payloadPackage.id,
        name: payloadPackage.name,
        quantity: 1,
        currency: "euro",
        originalPrice: payloadPackage.prices[0].price,
        vat: payloadPackage.prices[0].vat,
        grossPrice: payloadPackage.prices[0].price,
        netPrice: payloadPackage.prices[0].netPrice,
        sumOfVat: order.setSumOfItemPrice(payloadPackage.prices[0].vat, 1),
        sumOfGrossPrice: order.setSumOfItemPrice(payloadPackage.prices[0].price, 1),
        sumOfNetPrice: order.setSumOfItemPrice(payloadPackage.prices[0].netPrice, 1)
    }
    order.orderAmountPerItem= [itemAmount];
    order.orderAmount = order.setTotalAmount(order.orderAmountPerItem, 'euro');

    order.user = newUser._id;
    order.paymentMethod = {
        type: null, /* updated later from response of Adyen */
        recurringDetail: null /* updated later from async notification */
    }
    order.paymentStatus = { status: 'OPEN'};
    order.orderStatus = { status: 'RECEIVED' };
    order.paymentHistory.push(order.paymentStatus);
    order.orderStatusHistory.push(order.orderStatus);

    // set first deliverySchedule in subscription
    subscription.deliveryFrequency = 28; /** default value */
    subscription.deliveryDay = 4; /** default value */
    

    // retrieve order for subscription
    subscription.orders = [order];
    
    // update user object
    if (addressComparison === true) {
        newUser.addresses = [shippingAddress];
        newUser.defaultShippingAddress = shippingAddress;
        newUser.defaultBillingAddress = shippingAddress;
    } else {
        newUser.addresses = [shippingAddress, billingAddress];
        newUser.defaultShippingAddress = shippingAddress;
        newUser.defaultBillingAddress = billingAddress;
    }

    newUser.subscriptions = [subscription];
    newUser.orders = [order];
    newUser.billingOptions = [billingOption];
    newUser.defaultBillingOption = billingOption;

    //console.log(payloadToAdyen);
    adyenAxios.post('/payments/details', payloadToAdyen)
        .then((response) => {
            const resultCode = response.data.resultCode;
            const optinStatus = newUser.newsletterOptin;
            console.log(response.data);

            // submit optin request to sendGrid 
            // when user optted in during checkout
            if ((resultCode === "Authorised" && optinStatus) ||
                (resultCode === "Received" && optinStatus)) {
                
                const payload = {
                    contacts: [{ email: newUser.email }]
                };

                axiosSendGrid.put('/marketing/contacts', payload)
                .then(response => {
                    if (response.status === 202) {
                        logger.info(`successfully send optin request to sendGrid`);
                    }
                }).catch(error => {
                    errorDispatchers.dispatchSendGridOptinError(error);
                    next(error);
                });
            }

            if (resultCode === "Authorised" && addressComparison === true) {
                
                order.orderNumber = response.data.merchantReference;
                order.paymentMethod.type = response.data.paymentMethod;
                billingOption.type = response.data.paymentMethod;
    
                const firstDeliverySchedule = subscription.setFirstDeliverySchedule(subscription.deliveryDay, order.orderNumber);
                const nextDeliverySchedule =  subscription.setDeliverySchedule(firstDeliverySchedule.nextDeliveryDate, subscription.deliveryFrequency, subscription.deliveryDay);

                subscription.deliverySchedules = [
                    firstDeliverySchedule,
                    nextDeliverySchedule
                ];

                // add first delivery schedule in first order
                order.deliverySchedule = firstDeliverySchedule.nextDeliveryDate;
                
                Promise.all([
                    newUser.save(),
                    billingOption.save(),
                    shippingAddress.save(),
                    subscription.save(),
                    order.save()
                ])
                .then((values) => {
                    if (values) {
                        logger.info(`checkout is successfully processed (redirect) | ${resultCode} | ${newUser.email}`);
                        return res.status(201).json({
                            status: res.status,
                            resultCode: resultCode,
                            message: 'checkout success',
                            subscriptionId: subscription.subscriptionId,
                            orderNumber: order.orderNumber,
                            user: newUser.email
                        });
                    }
                }).catch(next);
                
            }
            else if (resultCode === "Authorised" && addressComparison === false) {
                
                order.orderNumber = response.data.merchantReference;
                order.paymentMethod.type = response.data.paymentMethod;
                billingOption.type = response.data.paymentMethod;
                
                const firstDeliverySchedule = subscription.setFirstDeliverySchedule(subscription.deliveryDay, order.orderNumber);
                const nextDeliverySchedule =  subscription.setDeliverySchedule(firstDeliverySchedule.nextDeliveryDate, subscription.deliveryFrequency, subscription.deliveryDay);

                subscription.deliverySchedules = [
                    firstDeliverySchedule,
                    nextDeliverySchedule
                ];
                // add first delivery schedule in first order
                order.deliverySchedule = firstDeliverySchedule.nextDeliveryDate

                Promise.all([
                    newUser.save(),
                    billingOption.save(),
                    shippingAddress.save(),
                    billingAddress.save(),
                    subscription.save(),
                    order.save()
                ])
                .then((values) => {
                    if (values) {
                        logger.info(`checkout is successfully processed (redirect) | ${resultCode} | ${newUser.email}`);
                        return res.status(201).json({
                            status: res.status,
                            resultCode: resultCode,
                            message: 'checkout success',
                            subscriptionId: subscription.subscriptionId,
                            orderNumber: order.orderNumber,
                            user: newUser.email
                        });
                    }
                }).catch(next);
                
            }

             else if (resultCode === "Received" && addressComparison === true) {
                order.orderNumber = response.data.merchantReference;
                order.paymentMethod.type = response.data.paymentMethod;
                billingOption.type = response.data.paymentMethod;

                const firstDeliverySchedule = subscription.setFirstDeliverySchedule(subscription.deliveryDay, order.orderNumber);
                const nextDeliverySchedule =  subscription.setDeliverySchedule(firstDeliverySchedule.nextDeliveryDate, subscription.deliveryFrequency, subscription.deliveryDay);

                subscription.deliverySchedules = [
                    firstDeliverySchedule,
                    nextDeliverySchedule
                ];
                // add first delivery schedule in first order
                order.deliverySchedule = firstDeliverySchedule.nextDeliveryDate;

                Promise.all([
                    newUser.save(),
                    billingOption.save(),
                    shippingAddress.save(),
                    billingAddress.save(),
                    subscription.save(),
                    order.save()
                ])
                .then((values) => {
                    if (values) {

                        logger.info(`checkout is successfully processed (redirect) | ${resultCode} | ${newUser.email}`);

                        return res.status(201).json({
                            status: res.status,
                            resultCode: resultCode,
                            message: 'user is created but authorisation of payment is pending',
                            subscriptionId: subscription.subscriptionId,
                            orderNumber: order.orderNumber,
                            user: newUser.email
                        });
                    }
                }).catch(next);

            }

            else if (resultCode === "Received" && addressComparison === false) {
                order.orderNumber = response.data.merchantReference;
                order.paymentMethod.type = response.data.paymentMethod;
                billingOption.type = response.data.paymentMethod;

                const firstDeliverySchedule = subscription.setFirstDeliverySchedule(subscription.deliveryDay, order.orderNumber);
                const nextDeliverySchedule =  subscription.setDeliverySchedule(firstDeliverySchedule.nextDeliveryDate, subscription.deliveryFrequency, subscription.deliveryDay);

                subscription.deliverySchedules = [
                    firstDeliverySchedule,
                    nextDeliverySchedule
                ];
                // add first delivery schedule in first order
                order.deliverySchedule = firstDeliverySchedule.nextDeliveryDate;

                Promise.all([
                    newUser.save(),
                    billingOption.save(),
                    shippingAddress.save(),
                    subscription.save(),
                    order.save()
                ])
                .then((values) => {
                    if (values) {

                        logger.info(`checkout is successfully processed (redirect) | ${resultCode} | ${newUser.email}`);

                        return res.status(201).json({
                            status: res.status,
                            resultCode: resultCode,
                            message: 'user is created but authorisation of payment is pending',
                            subscriptionId: subscription.subscriptionId,
                            orderNumber: order.orderNumber,
                            user: newUser.email
                        });
                    }
                }).catch(next);

            }

            else if (resultCode === "Refused") {
                logger.info(`checkout is refused (no redirect) | ${resultCode}| ${newUser.email}`);
                return res.status(200).json({
                    status: res.status,
                    resultCode: resultCode,
                    message: 'payment is refused from payment processor'
                });
            }

            else if (resultCode === "Cancelled") {
                logger.info(`checkout is cancelled (no redirect) | ${resultCode}| ${newUser.email}`);
                return res.status(200).json({
                    status: res.status,
                    resultCode: resultCode,
                    message: 'payment is canceled by user'
                });
            }

            else if (resultCode === "Error") {
                logger.warn(`checkout is failed (no redirect) | ${resultCode} | ${newUser.email}`);
                return res.status(500).json({
                    status: res.status,
                    resultCode: resultCode,
                    message: 'unexpected error in payment processing'
                });
            }

        })
        .catch(next);
}

module.exports = processRedirectedPayment;