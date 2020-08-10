const category = require('./core/category');
const brand = require('./core/brand');
const skinType = require('./core/skinType');
const product = require('./core/product');
const subscriptionBox = require('./core/subscriptionBox');
const subscription = require('./core/subscription');
const order = require('./core/order');
const cart = require('./core/cart');
const user = require('./core/user');

const addressLookup = require('./plugins/addressLookup');
const emailValidator = require('./plugins/emailValidator');
const payment = require('./plugins/payment');


let apiRoutesLoader = {}

apiRoutesLoader.mountCategoryRoutes = (router) => {
    const route = router
        .get('/admin/categories/', category.listCategories)
        .post('/admin/categories/category', category.createCategory)
    return route;
}

apiRoutesLoader.mountBrandRoutes = (router) => {
    const route = router
    .get('/admin/brands/', brand.listBrands)
    .post('/admin/brands/brand', brand.createBrand)
    return route;
};

apiRoutesLoader.mountSkinTypeRoutes = (router) => {
    const route = router
    .get('/admin/skinTypes/', skinType.listSkinTypes)
    .post('/admin/skinTypes/skinType', skinType.createSkinType)
    return route;
};

apiRoutesLoader.mountProductRoutes = (router) => {
    const route = router
    .get('/products/', product.listProducts)
    .get('/products/product/:id', product.getProductById)
    .post('/products/product', product.createProduct)
    .put('/products/product/:id', product.updateProduct)
    .delete('/products/product/:id', product.deleteProductById)
    return route;
};

apiRoutesLoader.mountSubscriptionBoxRoutes = (router) => {
    const route = router
    .get('/subscriptionBoxes', subscriptionBox.listSubscriptionBoxes)
    .get('/subscriptionBoxes/subscriptionBox/:id', subscriptionBox.getSubscriptionBoxById)
    .post('/subscriptionBoxes/subscriptionBox', subscriptionBox.createSubscriptionBox)
    .put('/subscriptionBoxes/subscriptionBox/:id', subscriptionBox.updateSubscriptionBox)
    .delete('/subscriptionBoxes/subscriptionBox/:id', subscriptionBox.deleteSubscriptionBoxById)
    return route;
};

apiRoutesLoader.mountOrderRoutes = (router) => {
    const route = router
    .get('/orders', order.listOrders)
    .get('/orders/order/:ordernumber', order.getOrderByOrdernumber)
    .put('/orders/order/:ordernumber/shipping', order.updateShippingStatus)
    .put('/orders/order/:ordernumber/shipping/items', order.updateShippingItems)
    .delete('/order/:ordernumber/shipping/items/:itemId', order.removePackedItems)
    return route;
}

apiRoutesLoader.mountCartRoutes = (router) => {
    const route = router
    .get('/carts', cart.listCarts)
    .get('/carts/cart/:id', cart.getCartById)
    .post('/carts/cart', cart.createCart)
    .put('/carts/cart/:id/state', cart.updateCartState)
    .put('/carts/cart/:id/items', cart.updateCartLineItems)
    .put('/carts/cart/:id/item/qty', cart.updateCartLineItemQty)
    .put('/carts/cart/:id/shipping', cart.updateShippingInfo)
    .put('/carts/cart/:id/payment', cart.updatePaymentInfo)
    .put('/carts/cart/:id/ownership', cart.updateCartOwnership)
    .delete('/carts/cart/:id', cart.deleteCartById)
    return route;
}

apiRoutesLoader.mountAddressLookup = (router) => {
    const route = router
    .post('/lookup/address', addressLookup.getAddressDetail)
    return route;
}

apiRoutesLoader.mountEmailValidator = (router) => {
    const route = router
    .post('/validation/email', emailValidator.validateEmail)
    return route;
}

apiRoutesLoader.mountPaymentRoutes = (router) => {
    const route = router
    .post('/payment/session', payment.createPaymentSession)
    .post('/payment/methods', payment.getPaymentMethods)
    .post('/payment/hook', payment.processWebhook)
    return route;
};

apiRoutesLoader.mountSubscriptionRoutes = (router) => {
    const route = router
    .get('/subscriptions', subscription.listSubscriptions)
    .get('/subscriptions/subscription/:id', subscription.getSubscriptionById)
    .put('/subscriptions/subscription/:id/status', subscription.updateSubscriptionStatus)
    return route;
};

apiRoutesLoader.mountUserRoutes = (router) => {
    const route = router
    .get('/users/user/:id', user.getUserDetail)
    .get('/users/user/:id/addresses', user.getUserAddresses)
    return route;
}

module.exports = apiRoutesLoader;