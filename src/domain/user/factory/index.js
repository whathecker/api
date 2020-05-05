const errors = require('../user-error');
const UserBaseFactory = require('../../_shared/factory').user_base_factory;

class UserFactory extends UserBaseFactory {
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
        defaultBillingOption,
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
            defaultBillingOption,
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
        defaultBillingOption,
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
        (defaultBillingOption)? this.defaultBillingOption = defaultBillingOption: null;
        (billingOptions)? this.billingOptions = billingOptions : null;
        (subscriptions)? this.subscriptions = subscriptions : null;
        (orders)? this.orders = orders : null;
        (creationDate)? this.creationDate = creationDate : null;
        (lastModified)? this.lastModified = lastModified : null;
        (lastLogin)? this.lastLogin = lastLogin : null;

        (isEmailVerified)? this.isEmailVerified = isEmailVerified : this.isEmailVerified = false;
        (newsletterOptin)? this.newsletterOptin = newsletterOptin : this.newsletterOptin = false;
    }
}

module.exports = UserFactory;