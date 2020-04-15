const errors = require('../user-error');

class UserFactory {
    constructor({
        email,
        userId,
        hash,
        salt,
        pwdResetToken,
        firstName,
        lastName,
        mobileNumber,
        addresses,
        defaultShippingAddress,
        defaultBillingAddress,
        billingOptions,
        subscriptions,
        orders,
        creationDate,
        lastModified,
        lastLogin,
        isEmailVerified,
        newsletterOptin
    } = {}) {

        const result_email = UserFactory.validateEmailAddress(email);

        if (!result_email) {
            return errors.genericErrors.invalid_email;
        }

        const payload = {
            email,
            userId,
            hash,
            salt,
            pwdResetToken,
            firstName,
            lastName,
            mobileNumber,
            addresses,
            defaultShippingAddress,
            defaultBillingAddress,
            billingOptions,
            subscriptions,
            orders,
            creationDate,
            lastModified,
            lastLogin,
            isEmailVerified,
            newsletterOptin
        };

        return new User(payload);
        // if no password what to do?
    }

    static validateEmailAddress (email) {
        return /\S+@\S+\.\S+/.test(email);
    }
}

class User {
    constructor({
        email,
        userId,
        hash,
        salt,
        pwdResetToken,
        firstName,
        lastName,
        mobileNumber,
        addresses,
        defaultShippingAddress,
        defaultBillingAddress,
        billingOptions,
        subscriptions,
        orders,
        creationDate,
        lastModified,
        lastLogin,
        isEmailVerified,
        newsletterOptin
    }= {}) {

        this.email = email;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;

        (hash)? this.hash = hash : null;
        (salt)? this.salt = salt : null;
        (pwdResetToken)? this.pwdResetToken = pwdResetToken : null;
        (mobileNumber)? this.mobileNumber = mobileNumber : null;
        (addresses)? this.addresses = addresses : null;
        (defaultShippingAddress)? this.defaultShippingAddress = defaultShippingAddress : null;
        (defaultBillingAddress)? this.defaultBillingAddress = defaultBillingAddress : null;
        (billingOptions)? this.billingOptions = billingOptions : null;
        (subscriptions)? this.subscriptions = subscriptions : null;
        (orders)? this.orders = orders : null;
        (creationDate)? this.creationDate = creationDate : null;
        (lastModified)? this.lastModified = lastModified : null;
        (lastLogin)? this.lastLogin = lastLogin : null;
        (isEmailVerified)? this.isEmailVerified = isEmailVerified : null;
        (newsletterOptin)? this.newsletterOptin = newsletterOptin : null;
    }
}

module.exports = UserFactory;