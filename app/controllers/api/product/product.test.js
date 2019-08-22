const app = require('../../../app');
const session = require('supertest-session');
const testHelpers = require('../../../utils/test/testHelpers');

let apikey = null;
let testSession = null;
let createdProduct = null;

const payload_invalid_category = {
    name: 'test product',
    description: 'this is test product',
    category: 'invalid',
    brand: process.env.TEST_BRAND_NAME_1,
    skinType: 'dry',
    prices: [{
        region: 'eu',
        currency: 'euro',
        price: '3.00'
    }]
};

const payload_invalid_brand = {
    name: 'test product',
    description: 'this is test product',
    category: process.env.TEST_CATEGORY_NAME,
    brand: 'invalid',
    skinType: 'dry',
    prices: [{
        region: 'eu',
        currency: 'euro',
        price: '3.00'
    }]
};

const payload_invalid_skinType = {
    name: 'test product',
    description: 'this is test product',
    category: process.env.TEST_CATEGORY_NAME,
    brand: process.env.TEST_BRAND_NAME_1,
    skinType: 'invalid',
    prices: [{
        region: 'eu',
        currency: 'euro',
        price: '3.00'
    }]
};
const payload_invalid_price = {
    name: 'test product',
    description: 'this is test product',
    category: process.env.TEST_CATEGORY_NAME,
    brand: process.env.TEST_BRAND_NAME_1,
    skinType: 'invalid',
    prices: {
        region: 'eu',
        currency: 'euro',
        price: '3.00'
    }
};

const payload_invalid_qtyType = {
    name: 'test product',
    description: 'this is test product',
    category: process.env.TEST_CATEGORY_NAME,
    brand: process.env.TEST_BRAND_NAME_1,
    skinType: 'dry',
    prices: [{
        region: 'eu',
        currency: 'euro',
        price: '10.00'
    }],
    quantityOnHand: 'odd value'
}

const payload_success = {
    name: 'test product',
    description: 'this is test product',
    category: process.env.TEST_CATEGORY_NAME,
    brand: process.env.TEST_BRAND_NAME_1,
    skinType: 'dry',
    prices: [{
        region: 'eu',
        currency: 'euro',
        price: '10.00'
    }],
    quantityOnHand: 10
}



describe('Test product endpoints', () => {
    testSession = session(app);

    beforeAll(() => {

        return Promise.all([
            testHelpers.createTestApikey(),
            testHelpers.createTestAdminUser(),
            testHelpers.createTestBrands(),
            testHelpers.createTestCategories(),
            testHelpers.createTestSkinTypes()
        ])
        .then(values => {
            apikey = values[0];
            email = values[1].email;
            password = process.env.TEST_ADMIN_USER_PASSWORD;

            return testSession.post('/admin/users/user/login')
            .set('X-API-Key', apikey)
            .send({
                email: email,
                password: password
            })
            .then(response => {
                expect(response.status).toBe(200);
            });
        });

    });

    afterAll(() => {
        return Promise.all([
            testHelpers.removeTestAdminUsers(),
            testHelpers.removeTestApikeys(),
            testHelpers.removeTestBrands(),
            testHelpers.removeTestCategories(),
            testHelpers.removeTestSkinTypes(),
            testHelpers.removeTestProducts(),
        ]);
    });

    test('getProducts success - length is 0', () => {
        return testSession.get('/products/')
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.products.length).toBe(0);
        });
    });

    test('createProduct fail - bad request', () => {
        return testSession.post('/products/product')
        .set('X-API-Key', apikey)
        .send({})
        .then(response => {
            expect(response.status).toBe(400);
        });
    });

    test('createProduct fail - invalid category', () => {
        return testSession.post('/products/product')
        .set('X-API-Key', apikey)
        .send(payload_invalid_category)
        .then(response => {
            expect(response.status).toBe(422);    
        });
    });
   
    test('createProduct fail - invalid brand', () => {
        return testSession.post('/products/product')
        .set('X-API-Key', apikey)
        .send(payload_invalid_brand)
        .then(response => {
            expect(response.status).toBe(422);    
        });
    });

    test('createProduct fail - invalid skinType', () => {
        return testSession.post('/products/product')
        .set('X-API-Key', apikey)
        .send(payload_invalid_skinType)
        .then(response => {
            expect(response.status).toBe(422);    
        });
    });
    
    test('createProduct fail - invalid prices', () => {
        return testSession.post('/products/product')
        .set('X-API-Key', apikey)
        .send(payload_invalid_price)
        .then(response => {
            expect(response.status).toBe(422);    
        });
    });

    test('createProduct fail - invalid qty type', () => {
        return testSession.post('/products/product')
        .set('X-API-Key', apikey)
        .send(payload_invalid_qtyType)
        .then(response => {
            expect(response.status).not.toBe(201);    
        });
    });
    
    test('createProduct success', () => {
        return testSession.post('/products/product')
        .set('X-API-Key', apikey)
        .send(payload_success)
        .then(response => {
            createdProduct = response.body.product;
            expect(response.status).toBe(201);
            expect(createdProduct.inventory.quantityOnHand).toBe(10);
            expect(createdProduct.inventoryHistory.length).toBe(1); 
            expect(createdProduct.prices[0].vat).toBe('1.74');
            expect(createdProduct.prices[0].netPrice).toBe('8.26');
        });
    });

    test('getProducts success - length is 1', () => {
        return testSession.get('/products/')
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.products.length).toBe(1);
        });
    });

    test('getProductById fail - invalid id', () => {
        return testSession.get('/products/product/invalid')
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('getProductById success', () => {
        return testSession.get(`/products/product/${createdProduct.id}`)
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.product.id).toBe(createdProduct.id);
        });
    });

    test('updateProduct fail - invalid id', () => {
        return testSession.put('/products/product/invalid')
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    

    test('updateProduct fail - invalid brandName', () => {
        return testSession.put(`/products/product/${createdProduct.id}`)
        .set('X-API-Key', apikey)
        .send({
            brand: 'invalid',
            category: process.env.TEST_CATEGORY_NAME,
            skinType: 'dry'
        })
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('updateProduct fail - invalid categoryName', () => {
        return testSession.put(`/products/product/${createdProduct.id}`)
        .set('X-API-Key', apikey)
        .send({
            brand: process.env.TEST_BRAND_NAME_1,
            category: 'invalid',
            skinType: 'dry'
        })
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('updateProduct fail - invalid skinType', () => {
        return testSession.put(`/products/product/${createdProduct.id}`)
        .set('X-API-Key', apikey)
        .send({
            brand: process.env.TEST_BRAND_NAME_1,
            category: process.env.TEST_CATEGORY_NAME,
            skinType: 'invalid'
        })
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('updateProduct fail - invalid prices data type', () => {
        return testSession.put(`/products/product/${createdProduct.id}`)
        .set('X-API-Key', apikey)
        .send({
            prices: {
                region: 'eu',
                currency: 'euro',
                price: '3.00'
            }
        })
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('updateProduct fail - invalid prices data', () => {
        return testSession.put(`/products/product/${createdProduct.id}`)
        .set('X-API-Key', apikey)
        .send({
            prices: {
                region: 'us',
                currency: 'usd',
                price: '3.00'
            }
        })
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('updateProduct fail - invalid qty data type', () => {
        return testSession.put(`/products/product/${createdProduct.id}`)
        .set('X-API-Key', apikey)
        .send({
            quantityOnHand: 'odd value'
        })
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('updateProduct success - inventory', () => {
        return testSession.put(`/products/product/${createdProduct.id}`)
        .set('X-API-Key', apikey)
        .send({
            quantityOnHand: 1000
        })
        .then(response => {
            expect(response.status).toBe(200)
        });
    });

    test('updateProduct success - name and description', () => {
        return testSession.put(`/products/product/${createdProduct.id}`)
        .set('X-API-Key', apikey)
        .send({ 
            name: 'updated',
            description: 'updated description'
        })
        .then(response => {
            expect(response.status).toBe(200);
        });
    });

    test('updateProduct success - prices', () => {
        return testSession.put(`/products/product/${createdProduct.id}`)
        .set('X-API-Key', apikey)
        .send({
            prices: [{
                region: 'eu',
                currency: 'euro',
                price: '3.00'
            }]
        })
        .then(response => {
            expect(response.status).toBe(200);
        });
    });

    test('getProductById  - check updated value', () => {
        return testSession.get(`/products/product/${createdProduct.id}`)
        .set('X-API-Key', apikey)
        .then(response => {
            const product = response.body.product;
            expect(response.status).toBe(200);
            expect(product.id).toBe(createdProduct.id);
            expect(product.name).toBe('updated');
            expect(product.description).toBe('updated description');
            expect(product.inventory.quantityOnHand).toBe(1000);
            expect(product.inventoryHistory.length).toBe(2);
            expect(product.prices[0].price).toBe('3.00');
            expect(product.prices[0].vat).toBe('0.52');
            expect(product.prices[0].netPrice).toBe('2.48');
        });
    });

    test('deleteProduct fail - invalid product id', () => {
        return testSession.delete(`/products/product/invalid`)
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('deleteProduct success', () => {
        return testSession.delete(`/products/product/${createdProduct.id}`)
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(200);
        });
    });

});