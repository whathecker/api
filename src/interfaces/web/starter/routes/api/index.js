const category =  require('./category');

const mountCategoryRoutes = (router) => {
    const route = router
        .get('/', category.listCategories)
        .post('/category', category.createCategory)
    return route;
}

module.exports = {
    mountCategoryRoutes
}