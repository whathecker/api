const adminUsers = [
    {
        _id: "1",
        email: "yunjae.oh@hellochokchok.com",
        userId: "ADMIN00001",
        hash: " ",
        salt: " ",
        isEmailVerified: true,
        adminApprovalRequired: false,
        isActive: true,
        creationDate: new Date('December 14, 1995 03:24:00'),
        lastModified: new Date('December 24, 1995 03:24:00'),
        lastLogin: new Date('December 24, 1995 03:24:00'),
    },
    {
        _id: "2",
        email: "tais.elize@hellochokchok.com",
        userId: "ADMIN00002",
        hash: " ",
        salt: " ",
        isEmailVerified: false,
        adminApprovalRequired: true,
        isActive: false,
        creationDate: new Date('December 14, 1996 03:24:00'),
        lastModified: new Date('December 24, 1996 03:24:00'),
        lastLogin: new Date('December 24, 1996 03:24:00'),
    }
];

module.exports = adminUsers;