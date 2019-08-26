const addressInterfaces = require('./interface/address-interface');
const brandInterfaces = require('./interface/brand-interface');
const apikeyInterfaces = require('./interface/apikey-interface');
const adminUserInterfaces = require('./interface/adminUser-interface');
const categoryInterfaces = require('./interface/category-interface');
const skinTypeInterfaces = require('./interface/skinType-interface');
const productInterfaces = require('./interface/product-interface');
const userInterfaces = require('./interface/user-interface');
const billingInterfaces = require('./interface/billing-interface');
const subscriptionInterfaces = require('./interface/subscription-interface');
const orderInterfaces = require('./interface/order-interface');
const boxInterfaces = require('./interface/box-interface');

module.exports = {
    addressInterfaces: addressInterfaces,
    brandInterfaces: brandInterfaces,
    apikeyInterfaces: apikeyInterfaces,
    adminUserInterfaces: adminUserInterfaces,
    categoryInterfaces: categoryInterfaces,
    skinTypeInterfaces: skinTypeInterfaces,
    productInterfaces: productInterfaces,
    userInterfaces: userInterfaces,
    billingInterfaces: billingInterfaces,
    subscriptionInterfaces: subscriptionInterfaces,
    orderInterfaces: orderInterfaces,
    boxInterfaces: boxInterfaces
}