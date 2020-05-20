const api = require('./api');
const { 
    mountCategoryRoutes,
    mountBrandRoutes
} = api;

const apiRoutesLoader = (routerObj) => {
    let router = routerObj;
    router.use('/admin/brands', mountBrandRoutes(router));
    router.use('/admin/categories', mountCategoryRoutes(router));
    return router;
}

module.exports = apiRoutesLoader;

