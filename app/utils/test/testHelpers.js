const mongoose = require('mongoose');
const Apikey = require('../../models/Apikey');
const AdminUser = require('../../models/AdminUser');

module.exports = {
    createTestApikey : () => {
        return new Promise((resolve, reject) => {
            const apikey = new Apikey();
            apikey.name = 'test';
            apikey.key = apikey.createApikey();
            apikey.save().then((apikey) => {
                console.log(apikey);
                resolve(apikey.key);
            })
            .catch(error => {
                reject(error);
            });
        });
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
    }
}