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
const Subscription = require('../../models/Subscription');
const Order = require('../../models/Order');

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
const dummyBoxDetails = [
    { 
        boxType: {
            skinType: 'dry',
            skinTypeCode: 'DR'
        },
        name: 'test package - 1',
        prices: [{
            region: 'eu',
            currency: 'euro',
            price: '24.95',
        }]
    }, 
    {
        boxType: {
            skinType: 'normal',
            skinTypeCode: 'NM'
        },
        name: 'test package - 2',
        prices: [{
            region: 'eu',
            currency: 'euro',
            price: '24.95',
        }]
    },
    {
        boxType: {
            skinType: 'oily',
            skinTypeCode: 'OL'
        },
        name: 'test package - 3',
        prices: [{
            region: 'eu',
            currency: 'euro',
            price: '24.95',
        }]
    }
];



module.exports = {
    dummyUserDetail: dummyUserDetail,
    dummyBrandDetails: dummyBrandDetails,
    dummyCategoryDetail: dummyCategoryDetail,
    dummySkinTypeDetails: dummySkinTypeDetails,
    dummyAdminUserDetail: dummyAdminUserDetail,
    dummyBoxDetails: dummyBoxDetails,
    dummyProductDetails: dummyProductDetails,

    createTestApikey : () => {
        return new Promise((resolve, reject) => {
            
            const apikey = modelInterface.apikey.createApikeyInstance(dummyApikeyDetail);

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

            const adminUser = modelInterface.adminUser.createAdminUserInstance(dummyAdminUserDetail);

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

            const brand1 = modelInterface.brand.createBrandInstance(dummyBrandDetails[0]);
            const brand2 = modelInterface.brand.createBrandInstance(dummyBrandDetails[1]);
            const brand3 = modelInterface.brand.createBrandInstance(dummyBrandDetails[2]);

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

            const category1 = modelInterface.category.createCategoryInstance(dummyCategoryDetail);
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

            const skinType1 = modelInterface.skinType.createSkinTypeInstance(dummySkinTypeDetails[0]);
            const skinType2 = modelInterface.skinType.createSkinTypeInstance(dummySkinTypeDetails[1]);
            const skinType3 = modelInterface.skinType.createSkinTypeInstance(dummySkinTypeDetails[2]);

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

            const product1 = modelInterface.product.createProductInstance(dummyProductDetails[0]);
            const product2 = modelInterface.product.createProductInstance(dummyProductDetails[1]);
            const product3 = modelInterface.product.createProductInstance(dummyProductDetails[2]);

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
    /**
     * public method: createTestPackages
     * 
     * @param {Array} products 
     * Array contain Product instances
     * 
     * Return: Promise (resolve with created packages, reject with error)
     */

    createTestSubscriptionBoxes: (products) => {
        return new Promise((resolve, reject) => {

            let box1 = modelInterface.box.createBoxInstance(dummyBoxDetails[0]);
            let box2 = modelInterface.box.createBoxInstance(dummyBoxDetails[1]);
            let box3 = modelInterface.box.createBoxInstance(dummyBoxDetails[2]);

            box1 = modelInterface.box.addPriceDetail(box1,dummyBoxDetails[0].prices);
            box2 = modelInterface.box.addPriceDetail(box2, dummyBoxDetails[1].prices);
            box3 = modelInterface.box.addPriceDetail(box3, dummyBoxDetails[2].prices);

            box1 = modelInterface.box.addItemDetails(box1, products);
            box2 = modelInterface.box.addItemDetails(box2, products);
            box3 = modelInterface.box.addItemDetails(box3, products);

            Promise.all([
                box1.save(),
                box2.save(),
                box3.save()
            ])
            .then(boxes => {
                resolve(boxes);
            })
            .catch(error => {
                reject(error);
            });
            
        });
    },
    createTestSubscribedUser: (packages) => {

        return new Promise((resolve, reject) => {

            // create user instance with basic info
            let user = modelInterface.user.createUserInstance(dummyUserDetail);
            
            // create address instances
            let shippingAddress = modelInterface.address.createAddressInstance(dummyUserDetail.shippingAddress, user._id);
            let billingAddress = modelInterface.address.createAddressInstance(dummyUserDetail.billingAddress, user._id);
            
            // extend user instance with addresses
            user = modelInterface.user.addAddressesToUser(user, shippingAddress, billingAddress);

            // create billing instance
            let billing = modelInterface.billing.createBillingInstance(dummyUserDetail.paymentDetail, user._id);

            const dummySubscriptionDetail = {
                country: 'netherlands',
                package: {
                    id: packages[0].id,
                    quantity: 1
                }
            };

            // create subscription instance
            let subscription = modelInterface.subscription.createSubscriptionInstance(dummySubscriptionDetail, user._id, billing._id);
            
            const dummyOrderDetail = {
                country: 'netherlands',
                isSubscription: true,
                deliveryInfo: {
                    deliveryFrequency: 28,
                    deliveryDay: 4
                },
                item: {
                    id: packages[0].id,
                    name: packages[0].name,
                    quantity: 1,
                    prices: packages[0].prices
                }
            }
            // create order instance
            let order = modelInterface.order.createOrderInstance(dummyOrderDetail.country, dummyOrderDetail.isSubscription, user._id);
            order = modelInterface.order.addItemDetail(order, dummyOrderDetail.item);
            order = modelInterface.order.addBillingInfo(order, billing, dummyUserDetail.paymentDetail.payment_method);
            order = modelInterface.order.updateAuthStatusOfFirstOrder(order);

            // extend subscription instance
            subscription = modelInterface.subscription.addFirstDeliveryInfos(subscription, dummyOrderDetail.deliveryInfo, order);
            subscription = modelInterface.subscription.addOrderInSubscription(subscription, order);
            
            // extend deliverySchedule at order instance
            order = modelInterface.order.addDeliverySchedule(order, subscription.deliverySchedules[0]);

            // extend user instance with billing
            user = modelInterface.user.addBillingOptionToUser(user, billing);
            // extend user instance with subscription
            user = modelInterface.user.addSubscriptionToUser(user, subscription);
            // extend user instance with order
            user = modelInterface.user.addOrderToUser(user, order);
            user = modelInterface.user.setDefaultBillingOption(user, order);


            // save all instances and resolve promise
            Promise.all([
                user.save(),
                shippingAddress.save(),
                billingAddress.save(),
                billing.save(),
                subscription.save(),
                order.save()
            ])
            .then(values => {

                const result = {
                    user: values[0],
                    shippingAddress: values[1],
                    billingAddress: values[2],
                    billing: values[3],
                    subscription: values[4],
                    order: values[5]
                }

                resolve(result);
            })
            .catch(error => {
                reject(error);
            });

        });
    },
    /**
     * public method: enrichProductsArray
     * 
     * @param {Array} products 
     * Array contain Product instances
     * 
     * Return: Promise 
     * resolve with enriched products array with isChecked, qtyToShip fields
     * result is used for sumbitting payload for updateShippingItems call
     * rejected with error
     */
    enrichProductsArray: (products) => {
        return new Promise((resolve, reject) => {
            if (!products) {
                reject(new Error('missing argument: products'));
            }
            if (!Array.isArray(products)) {
                reject(new Error('invalid argument type: products is not array'));
            }
            const enrichedProducts = products.map(product => {
    
                const enrichedProduct = {
                    channel: product.channel,
                    _id: product._id,
                    prices: product.prices,
                    inventoryHistory: product.inventoryHistory,
                    creationDate: product.creationDate,
                    lastModified: product.lastModified,
                    name: product.name,
                    description: product.description,
                    category: product.category,
                    categoryCode: product.categoryCode,
                    brand: product.brand,
                    brandCode: product.brandCode,
                    skinType: product.skinType,
                    id: product.id,
                    inventory: product.inventory,
                    isChecked: true,
                    qtyToShip: 2
                };
                return enrichedProduct;
            });
            
            resolve(enrichedProducts);
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
    },
    removeTestSubscribedUser: () => {
        return new Promise((resolve, reject) => {
            
            Promise.all([
                User.collection.drop(),
                Address.collection.drop(),
                Billing.collection.drop(),
                Subscription.collection.drop(),
                Order.collection.drop()
            ])
            .then(() => {
                resolve('User collection is dropped');
            })
            .catch(error => {
                reject(error);
            });
        });
    },
}