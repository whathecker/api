const stripe = require('stripe')('sk_test_aDx9AJdnvPc6iQqGXVsrILEy00LfAdcOv1');
const stripeHelpers = require('../../utils/stripe/stripeHelpers');
const logger = require('../../utils/logger');
const User = require('../../models/User');
const Address = require('../../models/Address');
const Billing = require('../../models/Billing');
const Subscription = require('../../models/Subscription');
const Order = require('../../models/Order');

async function completeCheckoutStripe (req, res, next) {
    
    const paymentIntent = req.body.paymentIntent;
    const userDetail = req.body.user;
    const packageDetail = req.body.package;
    const paymentMethod = req.body.paidBy;

    if (!paymentIntent || !userDetail || !packageDetail || !paymentMethod) {
        logger.warn('completeCheckoutStripe request has rejected as param is missing');
        return res.status(400).json({
            url: '/checkout/payment/confirmation',
            responseType: 'error',
            status: 400, 
            message: 'bad request' 
        });
    }

    // create customer on Stripe
    const stripeCustomer = await stripe.customers.create({
        payment_method: paymentIntent.payment_method,
    });
    console.log(stripeCustomer);

    const stripePaymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);
    console.log(stripePaymentMethod);
    // create payment method on Stripe

    // create User
    let newUser = new User();
    newUser.email = userDetail.email;
    newUser.userId = stripeCustomer.id;
    newUser.salt = newUser.setSalt();
    newUser.hash = newUser.setPassword(newUser, userDetail.password);
    newUser.firstName = userDetail.firstName;
    newUser.lastName = userDetail.lastName;
    newUser.mobileNumber = userDetail.mobileNumber;
    newUser.newsletterOptin = userDetail.newsletterOptin;

    const isAddressSame = stripeHelpers.isAddressesSame(userDetail.billingAddress, userDetail.shippingAddress);

    let shippingAddress = new Address();
    shippingAddress.firstName = userDetail.shippingAddress.firstName;
    shippingAddress.lastName = userDetail.shippingAddress.lastName;
    shippingAddress.postalCode = userDetail.shippingAddress.postalCode;
    shippingAddress.houseNumber = userDetail.shippingAddress.houseNumber;
    shippingAddress.houseNumberAdd = userDetail.shippingAddress.houseNumberAdd;
    shippingAddress.mobileNumber = userDetail.shippingAddress.mobileNumber;
    shippingAddress.streetName = userDetail.shippingAddress.streetName;
    shippingAddress.city = userDetail.shippingAddress.city;
    shippingAddress.province = userDetail.shippingAddress.province;
    shippingAddress.country = userDetail.shippingAddress.country;
    shippingAddress.user = newUser._id;

    let billingAddress;

    if (isAddressSame === true) {
        newUser.addresses = [shippingAddress];
        newUser.defaultShippingAddress = shippingAddress;
        newUser.defaultBillingAddress = shippingAddress;
    }

    if (isAddressSame === false) {

        billingAddress = new Address();
        billingAddress.firstName = userDetail.billingAddress.firstName;
        billingAddress.lastName = userDetail.billingAddress.lastName;
        billingAddress.postalCode = userDetail.billingAddress.postalCode;
        billingAddress.houseNumber = userDetail.billingAddress.houseNumber;
        billingAddress.houseNumberAdd = userDetail.billingAddress.houseNumberAdd;
        billingAddress.mobileNumber = userDetail.billingAddress.mobileNumber;
        billingAddress.streetName = userDetail.billingAddress.streetName;
        billingAddress.city = userDetail.billingAddress.city;
        billingAddress.province = userDetail.billingAddress.province;
        billingAddress.country = userDetail.billingAddress.country;
        billingAddress.user = newUser._id;

        newUser.addresses = [shippingAddress, billingAddress];
        newUser.defaultShippingAddress = shippingAddress;
        newUser.defaultBillingAddress = billingAddress;

    }
    
    // create Billing
    let billingOption = new Billing();
    billingOption.user = newUser._id;
    billingOption.type = stripePaymentMethod.card.brand;
    billingOption.billingId = paymentIntent.payment_method;

    // create Subscription
    const currentEnv = process.env.NODE_ENV;
    let subscription = new Subscription();
    const country = userDetail.shippingAddress.country.toLowerCase();
    subscription.subscriptionId = subscription.createSubscriptionId(currentEnv, country);
    const subscriptionItem = {
        itemId: packageDetail.id,
        quantity: 1
    } 
    subscription.subscribedItems = [subscriptionItem];
    subscription.user = newUser._id;
    subscription.paymentMethod = billingOption._id;

    // create order
    let order = new Order();
    order.orderNumber = order.createOrderNumber(currentEnv, country);
    order.invoiceNumber = order.createInvoiceNumber();
    order.isSubscription = true;
    const itemAmount = {
        itemId: packageDetail.id,
        name: packageDetail.name,
        quantity: 1,
        currency: "euro",
        originalPrice: packageDetail.prices[0].price,
        vat: packageDetail.prices[0].vat,
        grossPrice: packageDetail.prices[0].price,
        netPrice: packageDetail.prices[0].netPrice,
        sumOfVat: order.setSumOfItemPrice(packageDetail.prices[0].vat, subscriptionItem.quantity),
        sumOfGrossPrice: order.setSumOfItemPrice(packageDetail.prices[0].price, subscriptionItem.quantity),
        sumOfNetPrice: order.setSumOfItemPrice(packageDetail.prices[0].netPrice, subscriptionItem.quantity)
    }
    order.orderAmountPerItem = [itemAmount];
    order.orderAmount = order.setTotalAmount(order.orderAmountPerItem, 'euro');
    order.user = newUser._id;
    order.paymentMethod = {
        type: paymentMethod, 
        recurringDetail: paymentIntent.payment_method /** adyen field - not used in Stripe */
    };
    order.paymentStatus = { status: 'OPEN' };
    order.orderStatus = { status: 'RECEIVED' };
    order.paymentHistory.push(order.paymentStatus);
    order.orderStatusHistory.push(order.orderStatus)  

    // set first deliverySchedule in subscription
    subscription.deliveryFrequency = 28;
    subscription.deliveryDay = 4;
    const firstDeliverySchedule = subscription.setFirstDeliverySchedule(subscription.deliveryDay, order.orderNumber);
    const nextDeliverySchedule = subscription.setDeliverySchedule(firstDeliverySchedule.nextDeliveryDate, subscription.deliveryFrequency, subscription.deliveryDay);
    subscription.deliverySchedules = [
        firstDeliverySchedule,
        nextDeliverySchedule
    ];
    // add first delivery schedule in first order
    order.deliverySchedule = firstDeliverySchedule.nextDeliveryDate;
    subscription.orders = [order];

    newUser.subscriptions = [subscription];
    newUser.orders = [order];
    newUser.billingOptions = [billingOption];
    newUser.defaultBillingOption = billingOption;

    if (isAddressSame === true) {
        Promise.all([
            newUser.save(),
            billingOption.save(),
            shippingAddress.save(),
            !isAddressSame? billingAddress.save() : null ,
            subscription.save(),
            order.save()
        ])
        .then(values => {
            if (values) {
                logger.info(`checkout is successfully processed (no redirect) | ${newUser.email} is created`);     
                return res.status(201).json({
                    status: 'success',
                    message: 'checkout success',
                    subscriptionId: subscription.subscriptionId,
                    orderNumber: order.orderNumber,
                    user: newUser.email
                });
            }
        }).catch(next);
    }
}

module.exports = completeCheckoutStripe;