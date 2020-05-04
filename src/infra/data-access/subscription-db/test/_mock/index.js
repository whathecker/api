const mockSubscriptions = [
    {
        country: "NL",
        channel: "EU",
        deliveryFrequency: 28,
        deliveryDay: 4,
        isWelcomeEmailSent: true,
        orders: ["order_num_1", "order_num_2"],
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
        user_id: "2",
        paymentMethod_id: "2",
        creationDate: new Date('December 14, 1995 03:24:00'),
        lastModified: new Date('December 24, 1995 03:24:00'),
    },
    {
        country: "NL",
        channel: "EU",
        deliveryFrequency: 14,
        deliveryDay: 4,
        isWelcomeEmailSent: true,
        orders: ["order_num_1", "order_num_2"],
        isActive: true,
        deliverySchedules: [{
            orderNumber: "ECNL8092517700",
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
        user_id: "1",
        paymentMethod_id: "1",
        endDate: new Date('December 17, 1996 03:24:00'),
        creationDate: new Date('December 14, 1995 03:24:00'),
        lastModified: new Date('December 24, 1995 03:24:00'),
    }
];

module.exports = mockSubscriptions;