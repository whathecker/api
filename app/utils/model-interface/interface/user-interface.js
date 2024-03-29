const User = require('../../../models/User');

const userInterfaces = {};

/**
 * public method: createUserInstance
 * @param {object} userDetail 
 * Create instance of User from arguement contain following fields:
 * email, userId (stripe customer id), password, 
 * firstName, lastName, mobileNumber, newsletterOptin
 * 
 * Return: instance of User model
 */

userInterfaces.createUserInstance = (userDetail) => {

    if (!userDetail) {
        throw new Error('Missing argument: cannot create User instance without userDetail argument');
    }

    const user = new User();
    user.email = userDetail.email;
    user.userId = userDetail.userId;
    user.salt = user.setSalt();
    user.hash = user.setPassword(user, userDetail.password);
    user.firstName = userDetail.firstName;
    user.lastName = userDetail.lastName;
    user.mobileNumber = userDetail.mobileNumber;
    user.newsletterOptin = userDetail.newsletterOptin;
    
    return user;
}


/**
 * public method: addAddressesToUser
 * @param {object} userInstance 
 * Instance of User model
 * @param {object} shippingAddress 
 * Instance of Address model which represent shipping address of user
 * @param {object} billingAddress (optional)
 * Instance of Address model which represent billing address of user
 * 
 * Return: User instance extended with address
 */

userInterfaces.addAddressesToUser = (userInstance, shippingAddress, billingAddress) => {
    
    if (!userInstance) {
        throw new Error('Missing argument: userInstance cannot be ommitted');
    }

    if (!shippingAddress) {
        throw new Error('Missing argument: shippingAddress cannnot be ommitted');
    }

    if (!billingAddress) {
        userInstance.addresses = [shippingAddress];
        userInstance.defaultShippingAddress = shippingAddress;
        userInstance.defaultBillingAddress = shippingAddress;
    }

    if (billingAddress) {
        userInstance.addresses = [shippingAddress, billingAddress];
        userInstance.defaultShippingAddress = shippingAddress;
        userInstance.defaultBillingAddress = billingAddress;
    }
    
    return userInstance;
}

userInterfaces.addOrderToUser = (userInstance, orderInstance) => {

    if (!userInstance) {
        throw new Error('missing argument: userInstance');
    }

    if (!orderInstance) {
        throw new Error('missing argument: orderInstance');
    }

    userInstance.orders.push(orderInstance);

    return userInstance;

}

userInterfaces.addSubscriptionToUser = (userInstance, subscriptionInstance) => {
    
    if (!userInstance) {
        throw new Error('missing argument: userInstance');
    }

    if (!subscriptionInstance) {
        throw new Error('missing argument: subscriptionInstance');
    }

    userInstance.subscriptions.push(subscriptionInstance);

    return userInstance;
}

userInterfaces.addBillingOptionToUser = (userInstance, billingInstance) => {

    if (!userInstance) {
        throw new Error('missing argument: userInstance');
    }

    if (!billingInstance) {
        throw new Error('missing argument: billingInstance');
    }

    userInstance.billingOptions.push(billingInstance);

    return userInstance;
}

userInterfaces.setDefaultBillingOption = (userInstance, billingInstance) => {
    
    if (!userInstance) {
        throw new Error('missing argument: userInstance');
    }

    if (!billingInstance) {
        throw new Error('missing argument: billingInstance');
    }

    userInstance.defaultBillingOption = billingInstance;

    return userInstance;
}

module.exports = userInterfaces;