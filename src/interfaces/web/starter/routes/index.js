const api = require('./api');
const { mountCategoryRoutes } = api;

const apiRoutesLoader = (routerObj) => {
    let router = routerObj;

    router.use('/admin/categories', mountCategoryRoutes(router));

    return router;
}

module.exports = apiRoutesLoader;

