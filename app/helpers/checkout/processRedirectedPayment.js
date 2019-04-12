const User = require('../../models/User');
const Address = require('../../models/Address');
const Billing = require('../../models/Billing');
const Subscription = require('../../models/Subscription');
const Order = require('../../models/Order');
const crypto = require('crypto');
const logger = require('../../utils/logger');
const adyenAxios = require('../../../axios-adyen');


function processRedirectedPayment (req, res, next) {

    if (!req.body.details) {
        return res.status(400).json({
            status: res.status,
            message: 'bad request',
        });
    }
    console.log(req.body);
    const payloadForUser = req.body.user;
    const payloadPackage = req.body.package;
    let paidBy = null;
    const payloadToAdyen = {
        details: req.body.details
    }

    

    // construct new new user
    let newUser = new User();
    console.log(newUser);
    newUser.email = payloadForUser.email;
    newUser.salt = crypto.randomBytes(64).toString('hex');
    newUser.hash = newUser.setPassword(newUser, payloadForUser.password);
    newUser.firstName = payloadForUser.firstName;
    newUser.lastName = payloadForUser.lastName;
    newUser.mobileNumber = payloadForUser.mobileNumber;

    // construct new billing addresses
    let billingAddress = new Address();
    billingAddress.firstname = payloadForUser.billingAddress.firstName;
    billingAddress.lastName = payloadForUser.billingAddress.lastName;
    billingAddress.houseNumber = payloadForUser.billingAddress.houseNumber;
    billingAddress.houseNumberAdd = payloadForUser.billingAddress.houseNumberAdd;
    billingAddress.mobileNumber = payloadForUser.billingAddress.mobileNumber;
    billingAddress.streetName = payloadForUser.billingAddress.streetName;
    billingAddress.country = payloadForUser.billingAddress.country; /* to rework */
    billingAddress.user = newUser._id;

    // construct new shipping addresses
    let shippingAddress = new Address();
    shippingAddress.firstname = payloadForUser.shippingAddress.firstName;
    shippingAddress.lastName = payloadForUser.shippingAddress.lastName;
    shippingAddress.houseNumber = payloadForUser.shippingAddress.houseNumber;
    shippingAddress.houseNumberAdd = payloadForUser.shippingAddress.houseNumberAdd;
    shippingAddress.mobileNumber = payloadForUser.shippingAddress.mobileNumber;
    shippingAddress.streetName = payloadForUser.shippingAddress.streetName;
    shippingAddress.country = payloadForUser.shippingAddress.country; /* to rework */
    shippingAddress.user = newUser._id;

    // construct new billing option
    let billingOption = new Billing();
    billingOption.user = newUser._id;
    billingOption.type = null; /*updated later from response of Adyen */

    
    // construct new subscription
    const currentEnv = process.env.NODE_ENV;
    let subscription = new Subscription();
    subscription.subscriptionId = subscription.createSubscriptionId(currentEnv, payloadForUser.shippingAddress.country);
    subscription.package = payloadPackage._id;
    subscription.user = newUser._id;
    subscription.paymentMethod = billingOption._id;

    // construct first order of customer
    let order = new Order();
    order.orderNumber = null; /* updated later from response of Adyen */
    order.isSubscription = true; 
    order.items = payloadPackage.items;
    order.user = newUser._id;
    order.paymentMethod = {
        type: null, /* updated later from response of Adyen */
        recurringDetail: null /* updated later from async notification */
    }

    // retrieve order for subscription
    subscription.orders = [order];

    // update user object
    newUser.addresses = [shippingAddress, billingAddress];
    newUser.defaultShippingAddress = shippingAddress;
    newUser.defaultBillingAddress = billingAddress;
    newUser.subscriptions = [subscription];
    newUser.orders = [order];
    newUser.billingOptions = [billingOption];

    console.log(payloadToAdyen);
    adyenAxios.post('/payments/details', payloadToAdyen)
        .then((response) => {
            const resultCode = response.data.resultCode;
            console.log(response.data);

            if (resultCode === "Authorised") {
                
                order.orderNumber = response.data.merchantReference;
                order.paymentMethod.type = response.data.paymentMethod;
                billingOption.type = response.data.paymentMethod;

                Promise.all([
                    billingAddress.save(),
                    shippingAddress.save(),
                    billingOption.save(),
                    subscription.save(),
                    order.save(),
                    newUser.save()
                ])
                .then((values) => {
                    if (values) {
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

            if (resultCode === "Received") {
                order.orderNumber = response.data.merchantReference;
                order.paymentMethod.type = response.data.paymentMethod;
                billingOption.type = response.data.paymentMethod;

                Promise.all([
                    newUser.save(),
                    billingOption.save(),
                    billingAddress.save(),
                    shippingAddress.save(),
                    subscription.save(),
                    order.save()
                ])
                .then((values) => {
                    if (values) {
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

            if (resultCode === "Refused") {
                return res.status(200).json({
                    status: res.status,
                    resultCode: resultCode,
                    message: 'payment is refused from payment processor'
                });
            }

            if (resultCode === "Cancelled") {
                return res.status(200).json({
                    status: res.status,
                    resultCode: resultCode,
                    message: 'payment is canceled by user'
                });
            }

            if (resultCode === "Error") {
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