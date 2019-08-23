const AdminUser = require('../../../models/AdminUser');

const adminUserInterfaces = {};

/**
 * private method: createAdminUserInstance
 * @param {object} adminUserDetail:
 * object contain email, password, adminApprovalRequired field
 * 
 * Return: new instance of AdminUser model
 */
adminUserInterfaces.createAdminUserInstance = (adminUserDetail) => {
    
    if (!adminUserDetail) {
        throw new Error('Missing argument: cannnot create AdminUser instance without adminUserDetail argument');
    }

    const adminUser = new AdminUser();
    adminUser.email = adminUserDetail.email;
    adminUser.salt = adminUser.setSalt();
    adminUser.hash = adminUser.setPassword(adminUser, adminUserDetail.password);
    adminUser.adminApprovalRequired = false;
    adminUser.userId = adminUser.setAdminUserId();

    return adminUser;
}

module.exports = adminUserInterfaces;