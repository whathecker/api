const api = require('./api');
const { 
    mountCategoryRoutes,
    mountBrandRoutes, 
    mountSkinTypeRoutes
} = api;

const apiRoutesLoader = (routerObj) => {
    let router = routerObj;
    router.use('/admin/brands', mountBrandRoutes(router));
    router.use('/admin/categories', mountCategoryRoutes(router));
    router.use('/admin/skinTypes',mountSkinTypeRoutes(router));
    return router;
}

module.exports = apiRoutesLoader;

