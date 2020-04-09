const SubscriptionFactory = require('./index');

describe('Test SubscriptionFactory', () => {

    test('validateChannel must return false: invalid channel value', () => {
        const result = SubscriptionFactory.validateChannel('US');
        expect(result).toBe(false);
    });

    test('validateChannel must return true', () => {
        const result = SubscriptionFactory.validateChannel('EU');
        expect(result).toBe(true);
    });

    test('validateDeliveryFrequency must return false: cannot be lower than 1', () => {
        const result = SubscriptionFactory.validateDeliveryFrequency(0);
        expect(result).toBe(false);
    });

    test('validateDeliveryFrequency must return true', () => {
        const result = SubscriptionFactory.validateDeliveryFrequency(100);
        expect(result).toBe(true);
    });

    test('validateDeliveryDay must return false', () => {
        const result = SubscriptionFactory.validateDeliveryDay(7);
        const result2 = SubscriptionFactory.validateDeliveryDay(8);
        const result3 = SubscriptionFactory.validateDeliveryDay(9);
        const result4 = SubscriptionFactory.validateDeliveryDay(10);
        const result5 = SubscriptionFactory.validateDeliveryDay(11);

        const result6 = SubscriptionFactory.validateDeliveryDay(-1);
        const result7 = SubscriptionFactory.validateDeliveryDay(-2);
        const result8 = SubscriptionFactory.validateDeliveryDay(-3);

        expect(result).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);
        expect(result4).toBe(false);
        expect(result5).toBe(false);

        expect(result6).toBe(false);
        expect(result7).toBe(false);
        expect(result8).toBe(false);
    });

    test('validateDeliveryDay must return true', () => {
        const result = SubscriptionFactory.validateDeliveryDay(0);
        const result2 = SubscriptionFactory.validateDeliveryDay(1);
        const result3 = SubscriptionFactory.validateDeliveryDay(2);
        const result4 = SubscriptionFactory.validateDeliveryDay(3);
        const result5 = SubscriptionFactory.validateDeliveryDay(4);
        const result6 = SubscriptionFactory.validateDeliveryDay(5);
        const result7 = SubscriptionFactory.validateDeliveryDay(6);
        
        expect(result).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);
        expect(result4).toBe(true);
        expect(result5).toBe(true);
        expect(result6).toBe(true);
        expect(result7).toBe(true);
    });

    test('validateDeliverySchedules must return true', () => {
        const deliverySchedules = [{
            orderNumber: "ECNL8092517600",
            nextDeliveryDate: new Date('December 17, 1995 03:24:00'),
            year: 1995,
            month: 11,
            date: 17,
            day: 0,
        }];

        const result = SubscriptionFactory.validateDeliverySchedules(deliverySchedules);
        expect(result).toBe(true);
    });

    test('validateDeliverySchedules must return false', () => {
        const deliverySchedules = [
            {
                orderNumber: "ECNL8092517600",
                nextDeliveryDate: new Date('December 17, 1995 03:24:00'),
                year: 1995,
                month: 11,
                date: 17,
                day: 0,
            },
            {
                orderNumber: "ECNL8092517610",
                nextDeliveryDate: new Date('December 25, 1999 03:24:00'),
                year: 1999,
                month: 11,
                date: 25,
                day: 0,
            },
        ];

        const result = SubscriptionFactory.validateDeliverySchedules(deliverySchedules);
        expect(result).toBe(false);
    });

    test('validate_delivery_schedule must return true', () => {
        const deliverySchedule = {
            orderNumber: "ECNL8092517600",
            nextDeliveryDate: new Date('December 17, 1995 03:24:00'),
            year: 1995,
            month: 11,
            date: 17,
            day: 0,
        };

        const result = SubscriptionFactory.validate_delivery_schedule(deliverySchedule);
        expect(result).toBe(true);
    });

    test('validate_delivery_schedule must return false', () => {
        const deliverySchedule = {
            orderNumber: "ECNL8092517610",
            nextDeliveryDate: new Date('December 25, 1999 03:24:00'),
            year: 1999,
            month: 11,
            date: 25,
            day: 0,
        };
        
        const result = SubscriptionFactory.validate_delivery_schedule(deliverySchedule);
        expect(result).toBe(false);
    });

});