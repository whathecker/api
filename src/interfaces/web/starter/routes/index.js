const api = require('./api');
const { mountCategoryRoutes } = api;

class apiRoutesLoader {
    constructor (router) {
        this.router = router;
        this.router.use('/admin/categories', mountCategoryRoutes(this.router))

        return this.router;
    }
}

module.exports = apiRoutesLoader;
