const errors = require('../subscription-error');

const enum_channel = Object.freeze({
    0: 'EU'
});

const enum_env_prefixes = Object.freeze({
    test: "DV",
    local: "DV",
    development: "DV",
    staging: "ST",
    production: "EC",
});

const enum_country_prefixes = Object.freeze({
    NL: "NL",
});

class SubscriptionFactory {
    constructor({
        country,
        channel,
        deliveryFrequency,
        deliveryDay,
        isWelcomeEmailSent,
        orders,
        isActive,
        deliverySchedules,
        subscribedItems,
        subscriptionId,
        user,
        paymentMethod,
        endDate,
        creationDate,
        lastModified
    } = {}) {

        const result_channel = SubscriptionFactory.validateChannel(channel);

        if (!result_channel) {
            return errors.genericErrors.invalid_channel;
        }

        const result_deliveryFrequency = SubscriptionFactory.validateDeliveryFrequency(deliveryFrequency);

        if (!result_deliveryFrequency) {
            return errors.genericErrors.invalid_deliveryFrequency;
        }
        
        const result_deliveryDay = SubscriptionFactory.validateDeliveryDay(deliveryDay);

        if (!result_deliveryDay) {
            return errors.genericErrors.invalid_deliveryDay;
        }


        if (deliverySchedules.length !== 0) {

            const result_deliverySchedules = SubscriptionFactory.validateDeliverySchedules(deliverySchedules);

            if (!result_deliverySchedules) {
                return errors.genericErrors.invalid_deliverySchedule;
            }

        }

        if (!subscriptionId) {
            const payload = {
                envVar: process.env.NODE_ENV,
                country: country
            }
            subscriptionId = SubscriptionFactory.createSubscriptionId(payload);
        }

        const payload = {
            country,
            channel,
            deliveryFrequency,
            deliveryDay,
            isWelcomeEmailSent,
            orders,
            isActive,
            deliverySchedules,
            subscribedItems,
            subscriptionId,
            user,
            paymentMethod,
            endDate,
            creationDate,
            lastModified
        };

        return new Subscription(payload);
    }

    static validateChannel (channel) {
        let result = false;
        
        for (let prop of Object.keys(enum_channel)) {
            if (channel === enum_channel[prop]) {
                result = true;
                break;
            }
        }

        return result;
    }

    static validateDeliveryFrequency (deliveryFrequency) {
        if (deliveryFrequency <= 0) return false;

        return true;
    }

    static validateDeliveryDay (deliveryDay) {
        if (deliveryDay > 6 || deliveryDay < 0) return false;

        return true;
    }
    
    static validateDeliverySchedules (deliverySchedules) {
        let result = true;

        for (const element of deliverySchedules) {
            const validation_result = this.validate_delivery_schedule(element);

            if (!validation_result) {
                result = false;
                break;
            }
        }

        return result;
    }

    static validate_delivery_schedule (deliverySchedule) {

        const nextDeliveryDate = new Date(deliverySchedule.nextDeliveryDate);

        const year = nextDeliveryDate.getFullYear();
        const month = nextDeliveryDate.getMonth();
        const date = nextDeliveryDate.getDate();
        const day = nextDeliveryDate.getDay();

        if (deliverySchedule.year !== year) return false;
        if (deliverySchedule.month !== month) return false;
        if (deliverySchedule.date !== date) return false;
        if (deliverySchedule.day !== day) return false;

        return true;
    }

    static createSubscriptionId ({
        envVar,
        country
    } = {}) {
        let envPrefix  = this.get_env_prefix(envVar);
        let countryPrefix = this.get_country_prefix(country);
        let middlePrefix = 'SB';

        (envPrefix === null)? envPrefix = "DV" : null;
        (countryPrefix === null)? countryPrefix =  "NL" : null;

        const fiveDigitsNum = this.create_five_digits_integer();
        const fiveDigitsNum2 = this.create_five_digits_integer();

        return ''.concat(envPrefix, middlePrefix, countryPrefix, fiveDigitsNum, fiveDigitsNum2);
    }

    static create_five_digits_integer () {
        const num = Math.floor(Math.random() * 90000) + 10000;
        return num.toString();
    }

    static get_env_prefix (envVar) {
        const envPrefix = enum_env_prefixes[envVar];
        
        if (!envPrefix) {
            return null;
        }
        if (envPrefix) {
            return envPrefix;
        }
    }

    static get_country_prefix (country) {
        const countryPrefix = enum_country_prefixes[country];

        if (!countryPrefix) {
            return null;
        }
        if (countryPrefix) {
            return countryPrefix;
        }
    }
}


class Subscription {
    constructor({
        country,
        channel,
        deliveryFrequency,
        deliveryDay,
        isWelcomeEmailSent,
        orders,
        isActive,
        deliverySchedules,
        subscribedItems,
        subscriptionId,
        user,
        paymentMethod,
        endDate,
        creationDate,
        lastModified
    } ={}) {
        this.country = country;
        this.channel = channel;
        this.deliveryFrequency = deliveryFrequency;
        this.deliveryDay = deliveryDay;
        this.isWelcomeEmailSent = isWelcomeEmailSent;
        this.isActive = isActive;
        this.user = user;
        this.paymentMethod = paymentMethod;
        this.subscriptionId = subscriptionId;
        this.subscribedItems = subscribedItems;
        this.deliverySchedules = deliverySchedules;
        this.orders = orders;

        (endDate)? this.endDate = endDate : null;
        (creationDate)? this.creationDate = creationDate : null;
        (lastModified)? this.lastModified = lastModified : null;
    }
}


module.exports = SubscriptionFactory;