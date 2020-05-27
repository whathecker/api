const api = require('./api');
const { 
    mountCategoryRoutes,
    mountBrandRoutes, 
    mountSkinTypeRoutes,
    mountProductRoutes,
    mountSubscriptionBoxRoutes
} = api;

const apiRoutesLoader = (routerObj) => {
    let router = routerObj;
    router.use('/admin/brands', mountBrandRoutes(router));
    router.use('/admin/categories', mountCategoryRoutes(router));
    router.use('/admin/skinTypes',mountSkinTypeRoutes(router));
    router.use('/products', mountProductRoutes(router));
    router.use('/subscriptionBoxes', mountSubscriptionBoxRoutes(router));
    return router;
}

module.exports = apiRoutesLoader;

