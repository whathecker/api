const category =  require('./category');

const mountCategoryRoutes = (router) => {
    const route = router
        .get('/', category.list)
        .post('/category', category.create)
    return route;
}

module.exports = {
    mountCategoryRoutes
}