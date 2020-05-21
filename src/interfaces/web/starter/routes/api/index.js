const category = require('./category');
const brand = require('./brand');
const skinType = require('./skinType');
const product = require('./product');

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

module.exports = apiRoutesLoader;