const errors = require('./subscription-error');
const buildCreateSubscriptionObj = require('./subscription');
const subscriptionSchema = require('./subscription-schema');
const validator = require('../_shared/validator')(subscriptionSchema);
const createSubscriptionObj = buildCreateSubscriptionObj(validator);

const dummyData = {
    country: "NL",
    channel: "EU",
    deliveryFrequency: 28,
    deliveryDay: 4,
    isWelcomeEmailSent: true,
    orders: ["order_id_1", "order_id_2"],
    isActive: true,
    deliverySchedules: [{
        orderNumber: "ECNL8092517600",
        nextDeliveryDate: new Date('December 17, 1995 03:24:00'),
        year: 1995,
        month: 11,
        date: 17,
        day: 0,
    }],
    subscribedItems: [
        {
            itemId: "PKOL90587",
            quantity: 1
        },
    ],
    subscriptionId: "ECSBNL1272839153",
    user: "user_id",
    paymentMethod: "billing_id",
    endDate: new Date('December 17, 1996 03:24:00'),
    creationDate: new Date('December 14, 1995 03:24:00'),
    lastModified: new Date('December 24, 1995 03:24:00'),
};

function copyObj(obj) {
    return JSON.parse(JSON.stringify(obj));
}

describe('Make Subscription object', () => {

    test('object is created - without optional fields', () => {
        let payload = copyObj(dummyData);

        const originalSubscriptionId = payload.subscriptionId;
        const originalEndDate = payload.endDate;

        delete payload.subscriptionId;
        delete payload.endDate;

        const subscription = createSubscriptionObj(payload);

        expect(subscription.channel).toBe(payload.channel);
        expect(subscription.deliveryFrequency).toBe(payload.deliveryFrequency);
        expect(subscription.deliveryDay).toBe(payload.deliveryDay);
        expect(subscription.isWelcomeEmailSent).toBe(payload.isWelcomeEmailSent);
        expect(subscription.orders).toBe(payload.orders);
        expect(subscription.isActive).toBe(payload.isActive);
        expect(subscription.deliverySchedules).toBe(payload.deliverySchedules);
        expect(subscription.subscribedItems).toBe(payload.subscribedItems);
        expect(subscription.user).toBe(payload.user);
        expect(subscription.paymentMethod).toBe(payload.paymentMethod);

        expect(subscription.subscriptionId).not.toBe(originalSubscriptionId);
        expect(subscription.endDate).not.toBe(originalEndDate);
    });

    test('object is created with all fields', () => {
        let payload = copyObj(dummyData);

        const subscription = createSubscriptionObj(payload);

        expect(subscription.channel).toBe(payload.channel);
        expect(subscription.deliveryFrequency).toBe(payload.deliveryFrequency);
        expect(subscription.deliveryDay).toBe(payload.deliveryDay);
        expect(subscription.isWelcomeEmailSent).toBe(payload.isWelcomeEmailSent);
        expect(subscription.orders).toBe(payload.orders);
        expect(subscription.isActive).toBe(payload.isActive);
        expect(subscription.deliverySchedules).toBe(payload.deliverySchedules);
        expect(subscription.subscribedItems).toBe(payload.subscribedItems);
        expect(subscription.user).toBe(payload.user);
        expect(subscription.paymentMethod).toBe(payload.paymentMethod);

        expect(subscription.subscriptionId).toBe(payload.subscriptionId);
        expect(subscription.endDate).toBe(payload.endDate);
        expect(subscription.creationDate).toBe(payload.creationDate);
        expect(subscription.lastModified).toBe(payload.lastModified);
    });

    test('invalid channel', () => {
        let payload = copyObj(dummyData);
        payload.channel = "EMEA";

        const subscription = createSubscriptionObj(payload);
        
        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.genericErrors.invalid_channel.message);
    });

    test('deliveryFrequency cannot be less than 1', () => {
        let payload = copyObj(dummyData);
        payload.deliveryFrequency = 0;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.genericErrors.invalid_deliveryFrequency.message);
    });

    test('deliveryDay must be within range of 0 and 6', () => {
        let payload = copyObj(dummyData);
        payload.deliveryDay = 7;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.genericErrors.invalid_deliveryDay.message);
    });

    test('deliverySchedule object in deliverySchedules array contain invalid date', () => {
        let payload = copyObj(dummyData);
        payload.deliverySchedules[0].year = 3000;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.genericErrors.invalid_deliverySchedule.message);
    });
});

describe('Type checking: subscription object', () => {

    test('Subscription object must have a country property', () => {
        let payload = copyObj(dummyData);
        delete payload.country;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.country.message);
    });

    test('country property must be string', () => {
        let payload = copyObj(dummyData);
        delete payload.country;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.country.message);
    });

    test('channel property must be string', () => {
        let payload = copyObj(dummyData);
        payload.channel = true;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.channel.message);
    });

    test('subscriptionId property must be string if exist', () => {
        let payload = copyObj(dummyData);
        payload.subscriptionId = 101010;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.subscriptionId.message);
    });

    test('endDate property must be date if exist', () => {
        let payload = copyObj(dummyData);
        payload.endDate = true;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.endDate.message);
    });

    test('creationDate property must be date if exist', () => {
        let payload = copyObj(dummyData);
        payload.creationDate = true;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.creationDate.message);
    });

    test('lastModified property must be date if exist', () => {
        let payload = copyObj(dummyData);
        payload.lastModified = true;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.lastModified.message);
    });

    test('Subscription object must have a deliveryFrequency property', () => {
        let payload = copyObj(dummyData);
        delete payload.deliveryFrequency;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.deliveryFrequency.message);
    });

    test('deliveryFrequency property must be number', () => {
        let payload = copyObj(dummyData);
        payload.deliveryFrequency = true;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.deliveryFrequency.message);
    });

    test('Subscription object must have a deliveryDay property', () => {
        let payload = copyObj(dummyData);
        delete payload.deliveryDay;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.deliveryDay.message);
    });

    test('deliveryDay property must be number', () => {
        let payload = copyObj(dummyData);
        payload.deliveryDay = true;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.deliveryDay.message);
    });
    
    test('Subscription object must have a isWelcomeEmailSent property', () => {
        let payload = copyObj(dummyData);
        delete payload.isWelcomeEmailSent;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.isWelcomeEmailSent.message);
    });

    test('isWelcomeEmailSent property must be boolean', () => {
        let payload = copyObj(dummyData);
        payload.isWelcomeEmailSent = 'odd text';

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.isWelcomeEmailSent.message);
    });

    test('Subscription object must have a user property', () => {
        let payload = copyObj(dummyData);
        delete payload.user;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.user.message);
    });

    test('user property must be string', () => {
        let payload = copyObj(dummyData);
        payload.user = true;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.user.message);
    });

    test('Subscription object must have a paymentMethod property', () => {
        let payload = copyObj(dummyData);
        delete payload.paymentMethod;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.paymentMethod.message);
    });

    test('paymentMethod property must be string', () => {
        let payload = copyObj(dummyData);
        payload.paymentMethod = true;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.paymentMethod.message);
    });

    test('Subscription object must have a isActive property', () => {
        let payload = copyObj(dummyData);
        delete payload.isActive;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.isActive.message);
    });

    test('isActive property must be boolean', () => {
        let payload = copyObj(dummyData);
        payload.isActive = 'some text';

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.isActive.message);
    });

    test('orders property must be array', () => {
        let payload = copyObj(dummyData);
        payload.orders = true;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.orders.message);
    });

    test('Subscription object must have a itemId in item of subscribedItems property as string', () => {
        let payload = copyObj(dummyData);
        delete payload.subscribedItems[0].itemId;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.itemId_in_subscribedItems.message);
    });

    test('Subscription object must have a itemId in item of subscribedItems property as string', () => {
        let payload = copyObj(dummyData);
        payload.subscribedItems[0].itemId = true;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.itemId_in_subscribedItems.message);
    });

    test('Subscription object must have a quantity in item of subscribedItems property', () => {
        let payload = copyObj(dummyData);
        delete payload.subscribedItems[0].quantity;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.quantity_in_subscribedItems.message);
    });

    test('quantity in item of subscribedItems property must be number', () => {
        let payload = copyObj(dummyData);
        payload.subscribedItems[0].quantity = true;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.quantity_in_subscribedItems.message);
    });


    test('Subscription object must have a orderNumber in item of deliverySchedules property', () => {
        let payload = copyObj(dummyData);
        delete payload.deliverySchedules[0].orderNumber;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.orderNumber_in_deliverySchedules.message);
    });

    test('orderNumber in item of deliverySchedules property must be string', () => {
        let payload = copyObj(dummyData);
        payload.deliverySchedules[0].orderNumber = true;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.orderNumber_in_deliverySchedules.message);
    });

    test('Subscription object must have a nextDeliveryDate in item of deliverySchedules property', () => {
        let payload = copyObj(dummyData);
        delete payload.deliverySchedules[0].nextDeliveryDate;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.nextDeliveryDate_in_deliverySchedules.message);
    });

    test('nextDeliveryDate in item of deliverySchedules property must be date', () => {
        let payload = copyObj(dummyData);
        payload.deliverySchedules[0].nextDeliveryDate = true;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.nextDeliveryDate_in_deliverySchedules.message);
    });

    test('Subscription object must have a year in item of deliverySchedules property', () => {
        let payload = copyObj(dummyData);
        delete payload.deliverySchedules[0].year;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.year_in_deliverySchedules.message);
    });

    test('year in item of deliverySchedules property must be number', () => {
        let payload = copyObj(dummyData);
        payload.deliverySchedules[0].year = true;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.year_in_deliverySchedules.message);
    });

    test('Subscription object must have a month in item of deliverySchedules property', () => {
        let payload = copyObj(dummyData);
        delete payload.deliverySchedules[0].month;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.month_in_deliverySchedules.message);
    });

    test('month in item of deliverySchedules property must be number', () => {
        let payload = copyObj(dummyData);
        payload.deliverySchedules[0].month = true;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.month_in_deliverySchedules.message);
    });

    test('Subscription object must have a date in item of deliverySchedules property', () => {
        let payload = copyObj(dummyData);
        delete payload.deliverySchedules[0].date;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.date_in_deliverySchedules.message);
    });

    test('date in item of deliverySchedules property must be number', () => {
        let payload = copyObj(dummyData);
        payload.deliverySchedules[0].date = true;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.date_in_deliverySchedules.message);
    });

    test('Subscription object must have a day in item of deliverySchedules property', () => {
        let payload = copyObj(dummyData);
        delete payload.deliverySchedules[0].day;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.day_in_deliverySchedules.message);
    });

    test('day in item of deliverySchedules property must be number', () => {
        let payload = copyObj(dummyData);
        payload.deliverySchedules[0].day = true;

        const subscription = createSubscriptionObj(payload);

        expect(subscription instanceof Error).toBe(true);
        expect(subscription.message).toBe(errors.typeErrors.day_in_deliverySchedules.message);
    });


});