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

/**
 * private method: createApikeyInstance
 * @param {object} apikeyDetail:
 * object contain name field
 * 
 * Return: new instance of Apikey model
 */
function createApikeyInstance (apikeyDetail) {
    if (!apikeyDetail) {
        throw new Error('Missing argument: cannnot create Apikey instance without apikeyDetail argument');
    }
    const apikey = new Apikey();
    apikey.name = apikeyDetail.name;
    apikey.key = apikey.createApikey();
    return apikey;
}
/**
 * private method: createAdminUserInstance
 * @param {object} adminUserDetail:
 * object contain email, password, adminApprovalRequired field
 * 
 * Return: new instance of AdminUser model
 */

function createAdminUserInstance (adminUserDetail) {
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

/**
 * private method: createBrandInstance
 * @param {object} brandDetail:
 * object contain brandName and brandCode field
 * 
 * Return: new instance of Brand model
 */
function createBrandInstance (brandDetail) {
    if (!brandDetail) {
        throw new Error('Missing argument: cannnot create Brand instance without brandDetail argument');
    }

    const brand = new Brand();
    brand.brandName = brandDetail.brandName;
    brand.brandCode = brandDetail.brandCode;
    return brand;
}

/**
 * private method: createBrandInstance
 * @param {object} categoryDetail:
 * object contain categoryName and categoryCode field
 * 
 * Return: new instance of Category model
 */
function createCategoryInstance (categoryDetail) {
    if (!categoryDetail) {
        throw new Error('Missing argument: cannnot create Brand instance without categoryDetail argument');
    }

    const category = new Category();
    category.categoryName = categoryDetail.categoryName;
    category.categoryCode = categoryDetail.categoryCode;
    return category;
}

/**
 * private method: createSkinTypeInstance
 * @param {object} skinTypeDetail:
 * object contain skinType ield
 * 
 * Return: new instance of SkinType model
 */
function createSkinTypeInstance (skinTypeDetail) {
    if (!skinTypeDetail) {
        throw new Error('Missing argument: cannnot create Brand instance without skinTypeDetail argument');
    }

    const skinType = new SkinType();
    skinType.skinType = skinTypeDetail.skinType;
    skinType.skinTypeCode = skinType.setSkinTypeCode(skinType.skinType);
    return skinType;
}

/**
 * private method: createUserInstance
 * @param {object} userDetail 
 * Create instance of User from arguement contain following fields:
 * email, userId (stripe customer id), password, 
 * firstName, lastName, mobileNumber, newsletterOptin
 * 
 * Return: instance of User model
 */
function createUserInstance (userDetail) {
    if (!userDetail) {
        throw new Error('Missing argument: cannot create User instance without userDetail argument');
    }
    const user = new User();
    user.email = userDetail.email;
    user.userId = userDetail.userId;
    user.salt = user.setSalt();
    user.hash = user.setPassword(user, userDetail.password);
    user.firstName = userDetail.firstName;
    user.lastName = userDetail.lastName;
    user.mobileNumber = userDetail.mobileNumber;
    user.newsletterOptin = userDetail.newsletterOptin;
    
    return user;
}
/**
 * private method: addAddressesToUser
 * @param {object} userInstance 
 * Instance of User model
 * @param {object} shippingAddress 
 * Instance of Address model which represent shipping address of user
 * @param {object} billingAddress (optional)
 * Instance of Address model which represent billing address of user
 * 
 * Return: User instance extended with address
 */
function addAddressesToUser (userInstance, shippingAddress, billingAddress) {
    if (!userInstance) {
        throw new Error('Missing argument: userInstance cannot be ommitted');
    }
    if (!shippingAddress) {
        throw new Error('Missing argument: shippingAddress cannnot be ommitted');
    }
    if (!billingAddress) {
        userInstance.addresses = [shippingAddress];
        userInstance.defaultShippingAddress = shippingAddress;
        userInstance.defaultBillingAddress = shippingAddress;
    }
    if (billingAddress) {
        userInstance.addresses = [shippingAddress, billingAddress];
        userInstance.defaultShippingAddress = shippingAddress;
        userInstance.defaultBillingAddress = billingAddress;
    }
    return userInstance;
}
/**
 * private method: createAddressInstance
 * @param {Object} addressDetail 
 * Object contain following fields: 
 * firstName, lastName, postalCode, houseNumber, houseNumberAdd
 * mobileNumber, streetName, city, province, country
 * 
 * @param {String} userId 
 * object_id of User instance associated with the Address instance to be created
 * 
 * Return: new instance of Address
 */

function createAddressInstance (addressDetail, user_id) {
    if (!addressDetail) {
        throw new Error('Missing argument: addressDetail cannot be ommitted');
    }
    if (!user_id) {
        throw new Error('Missing argument: user_id cannot be ommitted');
    }
    const address = new Address();
    address.firstName = addressDetail.firstName;
    address.lastName = addressDetail.lastName;
    address.postalCode = addressDetail.postalCode;
    address.houseNumber = addressDetail.houseNumber;
    address.houseNumberAdd = addressDetail.houseNumberAdd;
    address.mobileNumber = addressDetail.mobileNumber;
    address.streetName = addressDetail.streetName;
    address.city = addressDetail.city;
    address.province = addressDetail.province;
    address.country = addressDetail.country;
    address.user = user_id;

    return address;
}
/**
 * private method: createBillingInstance
 * @param {object} paymentDetail 
 * @param {object} user_id 
 * Return: new instance of Billing model
 */
function createBillingInstance (paymentDetail, user_id) {
    if (!paymentDetail) {
        throw new Error('Missing argument: cannot create Billing instance without paymentDetail argument');
    }
    if (!user_id) {
        throw new Error('Missing argument: cannot create Billing instance without user_id');
    }

    const billing = new Billing();
    billing.user = user_id;
    billing.type = paymentDetail.card.brand;
    billing.billingId = paymentDetail.payment_method;

    return billing;
}



/**
 * private method: createProductInstance
 * @param {object} productDetail 
 * Return: new instance of Product model
 */

function createProductInstance (productDetail) {
    if (!productDetail) {
        throw new Error('Missing argument: cannot create Billing instance without productDetail argument');
    }

    const product = new Product();
    product.name = productDetail.name;
    product.description = productDetail.description;
    product.category = productDetail.category;
    product.categoryCode = productDetail.categoryCode;
    product.brand = productDetail.brand;
    product.brandCode = productDetail.brandCode;
    product.skinType = productDetail.skinType;
    product.id = product.createProductId(product.brandCode, product.categoryCode);
    product.prices = [{
        region: productDetail.prices[0].region,
        currency: productDetail.prices[0].currency,
        price: productDetail.prices[0].price,
        vat: product.setVat(productDetail.prices[0].price, 0.21),
        netPrice: product.setNetPrice(productDetail.prices[0].price, 0.21)
    }];
    product.inventory = { quantityOnHand: productDetail.qty };
    product.inventoryHistory = [product.inventory];

    return product;
}

function createSubscriptionBoxInstance () {

}

module.exports = {
    dummyUserDetail: dummyUserDetail,
    dummyBrandDetails: dummyBrandDetails,
    dummyCategoryDetail: dummyCategoryDetail,
    dummySkinTypeDetails: dummySkinTypeDetails,
    dummyAdminUserDetail: dummyAdminUserDetail,

    createTestApikey : () => {
        return new Promise((resolve, reject) => {
            
            const apikey = createApikeyInstance(dummyApikeyDetail);

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

            const adminUser = createAdminUserInstance(dummyAdminUserDetail);

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

            const brand1 = createBrandInstance(dummyBrandDetails[0]);
            const brand2 = createBrandInstance(dummyBrandDetails[1]);
            const brand3 =  createBrandInstance(dummyBrandDetails[2]);

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

            const category1 = createCategoryInstance(dummyCategoryDetail);
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

            const skinType1 = createSkinTypeInstance(dummySkinTypeDetails[0]);
            const skinType2 = createSkinTypeInstance(dummySkinTypeDetails[1]);
            const skinType3 = createSkinTypeInstance(dummySkinTypeDetails[2]);

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

            const product1 = createProductInstance(dummyProductDetails[0]);
            const product2 = createProductInstance(dummyProductDetails[1]);
            const product3 =  createProductInstance(dummyProductDetails[2]);

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
    createTestSubscribedUser: () => {
        return new Promise((resolve, reject) => {
            // create user instance with basic info
            // create address instances
            // extend user instance with addresses
            // create billing instance
            // create subscription instance
            // create order instance
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