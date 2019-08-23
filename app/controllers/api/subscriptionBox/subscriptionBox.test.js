const app = require('../../../app');
const session = require('supertest-session');
const testHelpers = require('../../../utils/test/testHelpers');

let apikey = null;
let testSession = null;
let createdProducts = null;
let createdBox = null;

describe('Test package apis', () => {
    testSession = session(app);

    beforeAll(() => {

        return Promise.all([
            testHelpers.createTestApikey(),
            testHelpers.createTestAdminUser(),
            testHelpers.createTestSkinTypes(),
            testHelpers.createTestProducts()
        ])
        .then(values => {
            apikey = values[0];
            email = values[1].email;
            password = process.env.TEST_ADMIN_USER_PASSWORD;

            // asssign dummy products in variable for subsequnet test runs
            createdProducts = values[3];

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
            testHelpers.removeTestSkinTypes(),
            testHelpers.removeTestProducts(),
            testHelpers.removeTestSubscriptionBoxes()
        ])
    });

    test('getSubscriptionBoxes success - length is 0', () => {
        return testSession.get('/subscriptionBoxes/')
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(0);
        });
    });

    test('createSubscriptionBoxes fail - bad request', () => {
        return testSession.post('/subscriptionBoxes/subscriptionBox')
        .set('X-API-Key', apikey)
        .send({})
        .then(response => {
            expect(response.status).toBe(400);
        });
    });

    // endpoint return 422 when boxType is invalid
    test('createSubscriptionBoxes fail - invalid boxType', () => {
        const payload = {
            name: 'test package',
            boxType: 'invalid',
            items: [
                createdProducts[0]._id, 
                createdProducts[1]._id, 
                createdProducts[2]._id
            ],
            prices: [{
                region: 'eu',
                currency: 'euro',
                price: '24.95'
            }]
        }
        return testSession.post('/subscriptionBoxes/subscriptionBox')
        .set('X-API-Key', apikey)
        .send(payload)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    // endpoint return 422 when prices field format is not array
    test('createSubscriptionBoxes fail - invalid data type of prices field', () => {
        const payload = {
            name: 'test package',
            boxType: 'dry',
            items: [
                createdProducts[0]._id, 
                createdProducts[1]._id, 
                createdProducts[2]._id
            ],
            prices: {
                region: 'eu',
                currency: 'euro',
                price: '24.95'
            }
        }

        return testSession.post('/subscriptionBoxes/subscriptionBox')
        .set('X-API-Key', apikey)
        .send(payload)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });
    // endpoint return 422 when price data is invalid
    test('createSubscriptionBoxes fail - invalid price data', () => {
        const payload = {
            name: 'test package',
            boxType: 'dry',
            items: [
                createdProducts[0]._id, 
                createdProducts[1]._id, 
                createdProducts[2]._id
            ],
            prices: [{
                region: 'us',
                currency: 'usd',
                price: '24.95'
            }]
        }

        return testSession.post('/subscriptionBoxes/subscriptionBox')
        .set('X-API-Key', apikey)
        .send(payload)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });
    // endpoint return 422 when items field is not array
    test('createSubscriptionBoxes fail - invalid data type of items field', () => {
        const payload = {
            name: 'test package',
            boxType: 'dry',
            items: createdProducts[0]._id, 
            prices: [{
                region: 'eu',
                currency: 'euro',
                price: '24.95'
            }]
        }

        return testSession.post('/subscriptionBoxes/subscriptionBox')
        .set('X-API-Key', apikey)
        .send(payload)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });
 
    test('createSubscriptionBoxes success', () => {
        const payload = {
            name: 'test package',
            boxType: 'dry',
            items: [
                createdProducts[0]._id, 
                createdProducts[1]._id, 
            ],
            prices: [{
                region: 'eu',
                currency: 'euro',
                price: '24.95'
            }]
        }
        return testSession.post('/subscriptionBoxes/subscriptionBox')
        .set('X-API-Key', apikey)
        .send(payload)
        .then(response => {
            createdBox = response.body.subscriptionBox;
            expect(response.status).toBe(201);
        });
    });
    // get box detail and compare id from prev test case
    test('getSubscriptionBoxById success', () => {
        return testSession.get(`/subscriptionBoxes/subscriptionBox/${createdBox.id}`)
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.subscriptionBox.id).toBe(createdBox.id);
        });
    });

    test('getSubscriptionBoxById fail - invalid id', () => {
        return testSession.get(`/subscriptionBoxes/subscriptionBox/invalid`)
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('getSubscriptionBoxes success - length is 1', () => {
        return testSession.get('/subscriptionBoxes/')
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
        });
    });
    
    test('updateSubscriptionBox fail - invalid id', () => {
        return testSession.put(`/subscriptionBoxes/subscriptionBox/invalid`)
        .set('X-API-Key', apikey)
        .send({ name: 'updated' })
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('updateSubscriptionBox fail - invalid boxType', () => {
        return testSession.put(`/subscriptionBoxes/subscriptionBox/${createdBox.id}`)
        .set('X-API-Key', apikey)
        .send({ 
            name: 'updated',
            boxType: 'invalid'
        })
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('updateSubscriptionBox fail - invalid data type of items', () => {
        return testSession.put(`/subscriptionBoxes/subscriptionBox/${createdBox.id}`)
        .set('X-API-Key', apikey)
        .send({ 
            name: 'updated',
            boxType: 'normal',
            items: createdProducts[2]._id
        })
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('updateSubscriptionBox fail - invalid data type of prices', () => {
        return testSession.put(`/subscriptionBoxes/subscriptionBox/${createdBox.id}`)
        .set('X-API-Key', apikey)
        .send({ 
            name: 'updated',
            boxType: 'normal',
            items: [createdProducts[2]._id],
            prices: {
                region: 'eu',
                currency: 'euro',
                price: '24.95'
            }
        })
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('updateSubscriptionBox fail - invalid price', () => {
        return testSession.put(`/subscriptionBoxes/subscriptionBox/${createdBox.id}`)
        .set('X-API-Key', apikey)
        .send({ 
            name: 'updated',
            boxType: 'normal',
            items: [createdProducts[2]._id],
            prices: [{
                region: 'us',
                currency: 'usd',
                price: '24.95'
            }]
        })
        .then(response => {
            expect(response.status).toBe(422);
        });
    });


    test('updateSubscriptionBox success - name and boxType', () => {
        return testSession.put(`/subscriptionBoxes/subscriptionBox/${createdBox.id}`)
        .set('X-API-Key', apikey)
        .send({ 
            name: 'updated',
            boxType: 'normal'
        })
        .then(response => {
            expect(response.status).toBe(200);
        });
    });

    test('updateSubscriptionBox success - price and items', () => {
        return testSession.put(`/subscriptionBoxes/subscriptionBox/${createdBox.id}`)
        .set('X-API-Key', apikey)
        .send({ 
            name: 'updated',
            boxType: 'normal',
            items: [createdProducts[2]],
            prices: [{
                region: 'eu',
                currency: 'euro',
                price: '100.00'
            }]
        })
        .then(response => {
            expect(response.status).toBe(200);
        });
    });

    test('getSubscriptionBoxById success - validate updated data', () => {
        return testSession.get(`/subscriptionBoxes/subscriptionBox/${createdBox.id}`)
        .set('X-API-Key', apikey)
        .then(response => {
            const subscriptionBox = response.body.subscriptionBox;
            expect(response.status).toBe(200);
            expect(subscriptionBox.name).toBe('updated');
            expect(subscriptionBox.boxType).toBe('normal');
            expect(subscriptionBox.boxTypeCode).toBe('NM');
            expect(subscriptionBox.prices[0].price).toBe('100.00');
            expect(subscriptionBox.prices[0].vat).toBe('17.36');
            expect(subscriptionBox.prices[0].netPrice).toBe('82.64');
            expect(subscriptionBox.items.length).toBe(1);
        });
    });

    test('deleteSubscriptionBox fail - invalid id', () => {
        return testSession.delete(`/subscriptionBoxes/subscriptionBox/invalid`)
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('deleteSubscriptionBox success', () => {
        return testSession.delete(`/subscriptionBoxes/subscriptionBox/${createdBox.id}`)
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(200);
        });
    });

    test('getSubscriptionBoxes success - length is 0', () => {
        return testSession.get('/subscriptionBoxes/')
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(0);
        });
    });
 
});