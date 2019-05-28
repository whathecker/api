const User = require('../../models/User');
const Address = require('../../models/Address');
const Billing = require('../../models/Billing');
const Subscription = require('../../models/Subscription');
const Order = require('../../models/Order');
const crypto = require('crypto');
const logger = require('../../utils/logger');
const adyenAxios = require('../../../axios-adyen');

function isAddressesSame (billingAddress, shippingAddress) {

    let compareResult = true;

    for (let prop in shippingAddress) {
        if (shippingAddress[prop] !== billingAddress[prop]) {
            compareResult = false;
        }
    }
    return compareResult;
}


function completeCheckout (req, res, next) {
    
    const payloadForUser = req.body.user;
    console.log(payloadForUser)
    const payloadPackage = req.body.package;
    const paidBy = req.body.paidBy;

    // construct new new user
    let newUser = new User(); 
    console.log(newUser);
    newUser.email = payloadForUser.email;
    newUser.salt = crypto.randomBytes(64).toString('hex');
    newUser.hash = newUser.setPassword(newUser, payloadForUser.password);
    newUser.firstName = payloadForUser.firstName;
    newUser.lastName = payloadForUser.lastName;
    newUser.mobileNumber = payloadForUser.mobileNumber;


    const addressComparison = isAddressesSame(payloadForUser.billingAddress, payloadForUser.shippingAddress);

    // construct new billing addresses
    let billingAddress = new Address();
    billingAddress.firstname = payloadForUser.billingAddress.firstName;
    billingAddress.lastName = payloadForUser.billingAddress.lastName;
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
    shippingAddress.firstname = payloadForUser.shippingAddress.firstName;
    shippingAddress.lastName = payloadForUser.shippingAddress.lastName;
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
    billingOption.type = paidBy;

    const currentEnv = process.env.NODE_ENV;
    // construct new subscription
    let subscription = new Subscription();
    const countryInLowerCase = payloadForUser.shippingAddress.country.toLowerCase();
    console.log(countryInLowerCase)
    subscription.subscriptionId = subscription.createSubscriptionId(currentEnv, countryInLowerCase);
    subscription.package = payloadPackage._id;
    subscription.user = newUser._id;
    subscription.paymentMethod = billingOption._id;

    // construct first order of customer
    let order = new Order();
    order.orderNumber = order.createOrderNumber(currentEnv, countryInLowerCase);
    order.isSubscription = true;
    order.items = payloadPackage.items;
    order.user = newUser._id;
    order.paymentMethod = {
        type: paidBy, 
        recurringDetail: null
    };
    order.paymentStatus = { status: 'OPEN' };
    order.orderStatus = { status: 'RECEIVED' };
    order.paymentHistory.push(order.paymentStatus);
    order.orderStatusHistory.push(order.orderStatus)  
    
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

    // update reference and shopperReference with created info
    req.body.payment.reference = order.orderNumber;
    req.body.payment.shopperReference = newUser.email; 

    const payloadForAdyen = req.body.payment;
    console.log(payloadForAdyen);
    
    // reach out to adyen for payment
    adyenAxios.post('/payments', payloadForAdyen)
        .then((response) => {
            const resultCode = response.data.resultCode;
            
            if (resultCode === 'Authorised' && addressComparison === true) {
            
                Promise.all([
                    newUser.save(),
                    billingOption.save(),
                    shippingAddress.save(),
                    subscription.save(),
                    order.save()
                ])
                .then((values)=> {
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

            else if (resultCode === 'Authorised' && addressComparison === false) {
                
                Promise.all([
                    newUser.save(),
                    billingOption.save(),
                    shippingAddress.save(),
                    billingAddress.save(),
                    subscription.save(),
                    order.save()
                ])
                .then((values)=> {
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

            else if (resultCode === "Pending" && addressComparison === true) {
                Promise.all([
                    newUser.save(),
                    billingOption.save(),
                    shippingAddress.save(),
                    subscription.save(),
                    order.save()
                ])
                .then((values)=> {
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

            else if (resultCode === "Pending" && addressComparison === false) {
                Promise.all([
                    newUser.save(),
                    billingOption.save(),
                    shippingAddress.save(),
                    billingAddress.save(),
                    subscription.save(),
                    order.save()
                ])
                .then((values)=> {
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

            else if (resultCode === 'Refused') {
                return res.status(200).json({
                    status: res.status,
                    resultCode: resultCode,
                    message: 'payment is refused from payment processor'
                });
            }

            else if (resultCode === "Cancelled") {
                return res.status(200).json({
                    status: res.status,
                    resultCode: resultCode,
                    message: 'payment is canceled by user'
                });
            }

            else if (resultCode === 'Error') {
                return res.status(500).json({
                    status: res.status,
                    resultCode: resultCode,
                    message: 'unexpected error in payment processing'
                });
            }

            else if (resultCode === 'RedirectShopper') {
                return res.status(202).json({
                    status: res.status,
                    resultCode: resultCode,
                    message: 'redirect shopper for further processing',
                    redirect: response.data.redirect
                });
            }
            
        }).catch(next);
}

module.exports = completeCheckout;