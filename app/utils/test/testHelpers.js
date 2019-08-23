const Apikey = require('../../models/Apikey');
const AdminUser = require('../../models/AdminUser');
const Brand = require('../../models/Brand');
const Category = require('../../models/Category');
const SkinType = require('../../models/SkinType');
const Product = require('../../models/Product');
const SubscriptionBox = require('../../models/SubscriptionBox');

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
    createTestBrands: () => {
        return new Promise((resolve, reject) => {

            const brand1 = new Brand();
            brand1.brandName = process.env.TEST_BRAND_NAME_1;
            brand1.brandCode = process.env.TEST_BRAND_CODE_1;

            const brand2 = new Brand();
            brand2.brandName = process.env.TEST_BRAND_NAME_2;
            brand2.brandCode = process.env.TEST_BRAND_CODE_2;

            const brand3 = new Brand();
            brand3.brandName = process.env.TEST_BRAND_NAME_3;
            brand3.brandCode = process.env.TEST_BRAND_CODE_3;

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

            const category1 = new Category();
            category1.categoryName = process.env.TEST_CATEGORY_NAME;
            category1.categoryCode = process.env.TEST_CATEGORY_CODE;

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

            const skinType1 = new SkinType();
            skinType1.skinType = 'dry';
            skinType1.skinTypeCode = skinType1.setSkinTypeCode(skinType1.skinType);

            const skinType2 = new SkinType();
            skinType2.skinType = 'normal';
            skinType2.skinTypeCode = skinType1.setSkinTypeCode(skinType2.skinType);

            const skinType3 = new SkinType();
            skinType3.skinType = 'oily';
            skinType3.skinTypeCode = skinType1.setSkinTypeCode(skinType3.skinType);

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

            const product1 = new Product();

            product1.name = 'test product 1';
            product1.description = 'this is test product 1';
            product1.category = process.env.TEST_CATEGORY_NAME;
            product1.categoryCode = process.env.TEST_CATEGORY_CODE;
            product1.brand = process.env.TEST_BRAND_NAME_1;
            product1.brandCode = process.env.TEST_BRAND_CODE_1;
            product1.skinType = 'dry';
            product1.id = product1.createProductId(product1.brandCode, product1.categoryCode);
            product1.prices = [{
                region: 'eu',
                currency: 'euro',
                price: '10.00',
                vat: product1.setVat('10.00', 0.21),
                netPrice: product1.setNetPrice('10.00', 0.21)
            }];
            product1.inventory = { quantityOnHand: 10 };
            product1.inventoryHistory = [product1.inventory];

            const product2 = new Product();
            product2.name = 'test product 2';
            product2.description = 'this is test product 2';
            product2.category = process.env.TEST_CATEGORY_NAME;
            product2.categoryCode = process.env.TEST_CATEGORY_CODE;
            product2.brand = process.env.TEST_BRAND_NAME_2;
            product2.brandCode = process.env.TEST_BRAND_CODE_2;
            product2.skinType = 'normal';
            product2.id = product2.createProductId(product2.brandCode, product2.categoryCode);
            product2.prices = [{
                region: 'eu',
                currency: 'euro',
                price: '10.00',
                vat: product2.setVat('10.00', 0.21),
                netPrice: product2.setNetPrice('10.00', 0.21)
            }];
            product2.inventory = { quantityOnHand: 10 };
            product2.inventoryHistory = [product2.inventory];

            const product3 = new Product();
            product3.name = 'test product 3';
            product3.description = 'this is test product 3';
            product3.category = process.env.TEST_CATEGORY_NAME;
            product3.categoryCode = process.env.TEST_CATEGORY_CODE;
            product3.brand = process.env.TEST_BRAND_NAME_3;
            product3.brandCode = process.env.TEST_BRAND_CODE_3;
            product3.skinType = 'normal';
            product3.id = product3.createProductId(product3.brandCode, product3.categoryCode);
            product3.prices = [{
                region: 'eu',
                currency: 'euro',
                price: '10.00',
                vat: product3.setVat('10.00', 0.21),
                netPrice: product3.setNetPrice('10.00', 0.21)
            }];
            product3.inventory = { quantityOnHand: 10 };
            product3.inventoryHistory = [product3.inventory];

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
    }
}