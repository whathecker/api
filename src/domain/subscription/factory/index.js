const errors = require('../subscription-error');

const enum_channel = Object.freeze({
    0: 'EU'
});

class SubscriptionFactory {
    constructor({
        channel,
        deliveryFrequency,
        deliveryDay,
        deliverySchedules
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

        // create subscription id if not exist
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
}


class Subscription {
    constructor({
        
    } ={}) {

    }
}


module.exports = SubscriptionFactory;