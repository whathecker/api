const mongoose = require('mongoose');
const Apikey = require('../../models/Apikey');
const AdminUser = require('../../models/AdminUser');
const Brand = require('../../models/Brand');
const Category = require('../../models/Category');

module.exports = {
    createTestApikey : () => {
        return new Promise((resolve, reject) => {
            const apikey = new Apikey();
            apikey.name = 'test';
            apikey.key = apikey.createApikey();
            apikey.save().then((apikey) => {
                resolve(apikey.key);
            })
            .catch(error => {
                reject(error);
            });
        });
    },
    createTestAdminUser: () => {
        return new Promise((resolve, reject) => {
            const adminUser = new AdminUser();
            adminUser.email = 'yunjae.oh@hellochokchok.com';
            adminUser.salt = adminUser.setSalt();
            adminUser.hash = adminUser.setPassword(adminUser, process.env.TEST_ADMIN_USER_PASSWORD);
            adminUser.adminApprovalRequired = false;
            adminUser.userId = adminUser.setAdminUserId();
            adminUser.save()
            .then(adminUser => {
                resolve(adminUser);
            })
            .catch(error => {
                reject(error);
            });
        })
    },
    removeTestApikeys: () => {
        return new Promise((resolve, reject) => {
            Apikey.collection.drop()
            .then(() => {
                resolve('Apikey is dropped');
            })
            .catch(error => {
                reject(error);
            });
        });
    },
    removeTestAdminUsers: () => {
        return new Promise((resolve, reject) => {
            AdminUser.collection.drop()
            .then(() => {
                resolve('AdminUser is dropped');
            })
            .catch(error => {
                reject(error);
            });
        })
    },
    removeTestBrands: () => {
        return new Promise((resolve, reject) => {
            Brand.collection.drop()
            .then(() => {
                resolve('Brand collection is droppped');
            })
            .catch(error => {
                reject(error);
            });
        })
    },
    removeTestCategories: () => {
        return new Promise((resolve, reject) => {
            Category.collection.drop()
            .then(() => {
                resolve('Category collection is droppped');
            })
            .catch(error => {
                reject(error);
            });
        });
    }
}