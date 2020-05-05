const users = [
    {
        _id: "1",
        email: "yunjae.oh@hellochokchok.com",
        userId: "1",
        hash: " ",
        salt: " ",
        firstName: "Yunjae",
        lastName: "Oh",
        mobileNumber: "06151515",
        addresses: ["1", "2"],
        defaultShippingAddress: "1",
        defaultBillingAddress: "2",
        defaultBillingOption: "pm_12345",
        billingOptions: ["pm_12345", "pm_12350"],
        subscriptions: ["ECSBNL1272839150"],
        orders: ["ECNL8092517700"],
        creationDate: new Date('December 14, 1995 03:24:00'),
        lastModified: new Date('December 24, 1995 03:24:00'),
        isEmailVerified: false,
        isEmailVerified: false
    },
    {
        _id: "2",
        email: "yunsoo.oh.nl@gmail.com",
        userId: "2",
        hash: " ",
        salt: " ",
        firstName: "Yunsoo",
        lastName: "Oh",
        mobileNumber: "06151516",
        addresses: ["3"],
        defaultShippingAddress: "3",
        defaultBillingAddress: "3",
        defaultBillingOption: "pm_12355",
        billingOptions: ["pm_12355"],
        subscriptions: ["ECSBNL1272839153"],
        orders: ["ECNL8092517600"],
        creationDate: new Date('December 14, 1995 03:24:00'),
        lastModified: new Date('December 24, 1995 03:24:00'),
        isEmailVerified: false,
        isEmailVerified: false
    }
];

module.exports = users;