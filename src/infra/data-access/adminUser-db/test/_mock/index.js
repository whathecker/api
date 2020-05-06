const mockAdminUsers = [
    {
        email: "yunjae.oh@hellochokchok.com",
        hash: " ",
        salt: " ",
        isEmailVerified: true,
        adminApprovalRequired: false,
        isActive: true,
        creationDate: new Date('December 14, 1995 03:24:00'),
        lastModified: new Date('December 24, 1995 03:24:00'),
    },
    {
        email: "tais.elize@hellochokchok.com",
        hash: " ",
        salt: " ",
        isEmailVerified: false,
        adminApprovalRequired: true,
        isActive: false,
        creationDate: new Date('December 14, 1996 03:24:00'),
        lastModified: new Date('December 24, 1996 03:24:00'),
    }
];

module.exports = mockAdminUsers;