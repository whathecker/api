const Apikey = require('../../models/Apikey');
const AdminUser = require('../../models/AdminUser');
const Brand = require('../../models/Brand');
const Category = require('../../models/Category');
const SkinType = require('../../models/SkinType');
const Product = require('../../models/Product');
const SubscriptionBox = require('../../models/SubscriptionBox');
const User = require('../../models/User');
const Address = require('../../models/Address');
const Billing = require('../../models/Billing');

const modelInterface = require('../model-interface');

const dummyApikeyDetail = { name: 'test' };

const dummyAdminUserDetail = {
    email: 'yunjae.oh@hellochokchok.com',
    password: 'thisistestpassword',
    adminApprovalRequired: false,
};

const dummyUserDetail = {
    email: 'yunjae.oh.nl@gmail.com',
    userId: 'pi_1FAB2JAwZopNuXPMD6cYp79N', // dummy stripe customer id
    password: 'thisistestpassword',
    firstName: 'Yunjae',
    lastName: 'Oh',
    mobileNumber: '',
    newsletterOptin: false,
    shippingAddress: {
        firstName: 'Yunjae',
        lastName: 'Oh',
        postalCode: '1093TV',
        houseNumber: '42',
        houseNumberAdd: '',
        mobileNumber: '',
        streetName: 'Commelinestraat',
        city: 'Amsterdam',
        province: 'North-Holland',
        country: 'Netherlands'
    },
    billingAddress: {
        firstName: 'Tais',
        lastName: 'Elize',
        postalCode: '1093TV',
        houseNumber: '44',
        houseNumberAdd: '',
        mobileNumber: '',
        streetName: 'Commelinestraat',
        city: 'Amsterdam',
        province: 'North-Holland',
        country: 'Netherlands'
    },
    paymentDetail: {
        card: { brand: 'visa' },
        payment_method: 'pm_1FAB4wAwZopNuXPMlFuDRvmq' // stripe dummy value
    }
};

const dummyBrandDetails = [
    { 
        brandName: 'brand1',
        brandCode: 'BO'
    },
    {
        brandName: 'brand2',
        brandCode: 'BT'
    },
    {
        brandName: 'brand3',
        brandCode: 'BR'
    }
];

const dummyCategoryDetail = {
    categoryName: 'sheetmask',
    categoryCode: 'ST'
};

const dummySkinTypeDetails = [
    { skinType: 'dry'},
    { skinType: 'normal'},
    { skinType: 'oily'}
];

const dummyProductDetails = [
    {
        name: 'test product 1',
        description: 'this is test product 1',
        category: 'sheetmask',
        categoryCode: 'ST',
        brand: 'brand1',
        brandCode: 'BO',
        skinType: 'dry',
        prices: [{
            region: 'eu',
            currency: 'euro',
            price: '10.00',
        }],
        qty: 10
    },
    {
        name: 'test product 2',
        description: 'this is test product 2',
        category: 'sheetmask',
        categoryCode: 'ST',
        brand: 'brand2',
        brandCode: 'BT',
        skinType: 'normal',
        prices: [{
            region: 'eu',
            currency: 'euro',
            price: '10.00',
        }],
        qty: 10
    },
    {
        name: 'test product 3',
        description: 'this is test product 3',
        category: 'sheetmask',
        categoryCode: 'ST',
        brand: 'brand3',
        brandCode: 'BR',
        skinType: 'oily',
        prices: [{
            region: 'eu',
            currency: 'euro',
            price: '10.00',
        }],
        qty: 10
    }
];

module.exports = {
    dummyUserDetail: dummyUserDetail,
    dummyBrandDetails: dummyBrandDetails,
    dummyCategoryDetail: dummyCategoryDetail,
    dummySkinTypeDetails: dummySkinTypeDetails,
    dummyAdminUserDetail: dummyAdminUserDetail,

    createTestApikey : () => {
        return new Promise((resolve, reject) => {
            
            const apikey = modelInterface.apikeyInterfaces.createApikeyInstance(dummyApikeyDetail);

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

            const adminUser = modelInterface.adminUserInterfaces.createAdminUserInstance(dummyAdminUserDetail);

            adminUser.save()
            .then(adminUser => {
                resolve(adminUser);
            })
            .catch(error => {
                reject(error);
            });

        });
    },
    createTestBrands: () => {
        return new Promise((resolve, reject) => {

            const brand1 = modelInterface.brandInterfaces.createBrandInstance(dummyBrandDetails[0]);
            const brand2 = modelInterface.brandInterfaces.createBrandInstance(dummyBrandDetails[1]);
            const brand3 = modelInterface.brandInterfaces.createBrandInstance(dummyBrandDetails[2]);

            Promise.all([
                brand1.save(),
                brand2.save(),
                brand3.save()
            ])
            .then(brands => {
                resolve(brands);
            })
            .catch(error => {
                reject(error);
            });
        });
    },
    createTestCategories: () => {
        return new Promise((resolve, reject) => {

            const category1 = modelInterface.categoryInterfaces.createCategoryInstance(dummyCategoryDetail);
            category1.save().then(category => {
                resolve(category);
            })
            .catch(error => {
                reject(error);
            });

        });
    },
    createTestSkinTypes: () => {
        return new Promise((resolve, reject) => {

            const skinType1 = modelInterface.skinTypeInterfaces.createSkinTypeInstance(dummySkinTypeDetails[0]);
            const skinType2 = modelInterface.skinTypeInterfaces.createSkinTypeInstance(dummySkinTypeDetails[1]);
            const skinType3 = modelInterface.skinTypeInterfaces.createSkinTypeInstance(dummySkinTypeDetails[2]);

            Promise.all([
                skinType1.save(),
                skinType2.save(),
                skinType3.save()
            ])
            .then(skinTypes => {
                resolve(skinTypes);
            })
            .catch(error => {
                reject(error);
            });
        });

    },
    createTestProducts: () => {
        return new Promise((resolve, reject) => {

            const product1 = modelInterface.productInterfaces.createProductInstance(dummyProductDetails[0]);
            const product2 = modelInterface.productInterfaces.createProductInstance(dummyProductDetails[1]);
            const product3 = modelInterface.productInterfaces.createProductInstance(dummyProductDetails[2]);

            Promise.all([
                product1.save(),
                product2.save(),
                product3.save()
            ])
            .then(products => {
                resolve(products);
            })
            .catch(error => {
                reject(error);
            });
            
        });
    },
    createTestPackages: () => {
        return new Promise((resolve, reject) => {

        });
    },
    createTestSubscribedUser: () => {
        return new Promise((resolve, reject) => {
            // create user instance with basic info
            // create address instances
            // extend user instance with addresses
            // create billing instance
            // create subscription instance
            // create order instance
            // extend subscription instance
            // extend user instance with billing
            // extend user instance with subscription
            // extend user instance with order


            // save all instances and resolve promise
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
    },
    removeTestSkinTypes: () => {
        return new Promise((resolve, reject) => {
            SkinType.collection.drop()
            .then(() => {
                resolve('SkinType collection is dropped');
            })
            .catch(error => {
                reject(error);
            });
        });
    },
    removeTestProducts: () => {
        return new Promise((resolve, reject) => {
            Product.collection.drop()
            .then(() => {
                resolve('Product collection is droppped');
            })
            .catch(error => {
                reject(error);
            });
        });
    },
    removeTestSubscriptionBoxes: () => {
        return new Promise((resolve, reject) => {
            SubscriptionBox.collection.drop()
            .then(() => {
                resolve('SubscriptionBox collection is dropped');
            })
            .catch(error => {
                reject(error);
            });
        });
    },
    removeTestSubscribedUser: () => {
        return new Promise((resolve, reject) => {
            User.collection.drop()
            .then(() => {
                resolve('User collection is dropped');
            })
            .catch(error => {
                reject(error);
            });
        });
    }
}