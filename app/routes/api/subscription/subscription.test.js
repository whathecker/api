const app = require('../../../app');
const session = require('supertest-session');
const testHelpers = require('../../../utils/test/testHelpers');

let apikey = null;
let products = null;
let createdSubscription = null;
let createdOrder = null;

describe('Test subscription endpoints', () => {
    const testSession = session(app);

    beforeAll(() => {

        return Promise.all([
            testHelpers.createTestApikey(),
            testHelpers.createTestAdminUser(),
            testHelpers.createTestProducts()
        ])
        .then(values => {

            apikey = values[0];
            email = testHelpers.dummyAdminUserDetail.email;
            password = testHelpers.dummyAdminUserDetail.password;
            products = values[2];

            return testHelpers.createTestSubscriptionBoxes(products)
            .then(boxes => {

                return testHelpers.createTestSubscribedUser(boxes)
                .then(result => {

                    createdSubscription = result.subscription;
                    createdOrder = result.order;
                    console.log(createdSubscription);
                    console.log(createdOrder);
                    
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

        });

    });

    afterAll(() => {
        return Promise.all([
            testHelpers.removeTestAdminUsers(),
            testHelpers.removeTestApikeys(),
            testHelpers.removeTestProducts(),
            testHelpers.removeTestSubscriptionBoxes(),
            testHelpers.removeTestSubscribedUser()
        ]);
    });

    test('getSubscriptions success- length is 1', () => {
        return testSession.get('/subscriptions')
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.subscriptions).toHaveLength(1);
        });
    });

    test('getSubscriptionById fail - unknown subscription id', () => {
        return testSession.get(`/subscriptions/subscription/invalid`)
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    
    
    test('getSubscriptionById success - check detail of newly created subscription', () => {
        return testSession.get(`/subscriptions/subscription/${createdSubscription.subscriptionId}`)
        .set('X-API-Key', apikey)
        .then(response => {
            const subscription = response.body.subscription;

            expect(response.status).toBe(200);
            expect(subscription).toHaveProperty('subscriptionId');
            expect(subscription).toHaveProperty('user');
            expect(subscription).toHaveProperty('paymentMethod');
            expect(subscription).toHaveProperty('subscribedItems');
            expect(subscription).toHaveProperty('deliveryFrequency');
            expect(subscription).toHaveProperty('deliveryDay');
            expect(subscription).toHaveProperty('orders');
            expect(subscription).toHaveProperty('deliverySchedules');
            expect(subscription.deliverySchedules.length).toBeGreaterThan(0);
            expect(subscription.deliverySchedules[0]).toHaveProperty('nextDeliveryDate');
            expect(subscription.deliverySchedules[0]).toHaveProperty('year');
            expect(subscription.deliverySchedules[0]).toHaveProperty('month');
            expect(subscription.deliverySchedules[0]).toHaveProperty('date');
            expect(subscription.deliverySchedules[0]).toHaveProperty('day'); 

        });
    }); 

    test('changeSubscriptionStatus fail - bad request', () => {
        return testSession.put(`/subscriptions/subscription/invalid/status`)
        .set('X-API-Key', apikey)
        .send({})
        .then(response => {
            expect(response.status).toBe(400);
        });
    });

    test('changeSubscriptionStatus fail - unknown subscription', () => {
        return testSession.put(`/subscriptions/subscription/invalid/status`)
        .set('X-API-Key', apikey)
        .send({
            update: {
                isActive: false
            }
        })
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('changeSubscriptionStatus success - inactive subscription', () => {
        return testSession.put(`/subscriptions/subscription/${createdSubscription.subscriptionId}/status`)
        .set('X-API-Key', apikey)
        .send({
            update: {
                isActive: false
            }
        })
        .then(response => {
            expect(response.status).toBe(200);
        });
    });

    // add test case to check delivery schedule..

    describe('Test updateShippingItems, updateShippingStatus at inactive subscription', () => {
        let updatedItems;

        beforeAll(() => {

            return testHelpers.enrichProductsArray(products)
            .then(enrichedProducts => {
                updatedItems = enrichedProducts;
                return;
            })
        });

        test('updateShippingItems success', () => {
            return testSession.put(`/orders/order/${createdOrder.orderNumber}/shipping/items`)
            .set('X-API-Key', apikey)
            .send({
                update: { items: updatedItems }
            })
            .then(response => {
                expect(response.status).toBe(200);
            });
        });

        test('updateShippingStatus success', () => {
            return testSession.put(`/orders/order/${createdOrder.orderNumber}/shipping`)
            .set('X-API-Key', apikey)
            .send({
                update: {
                    courier: 'DHL',
                    trackingNumber: ['1234']
                }
            })
            .then(response => {
                const subscription = response.body.subscription;
                expect(response.status).toBe(200);
            });
        });

    })

    test('changeSubscriptionStatus success - active subscription', () => {
        
        setTimeout(() => {
            return testSession.put(`/subscriptions/subscription/${createdSubscription.subscriptionId}/status`)
            .set('X-API-Key', apikey)
            .send({
                update: {
                    isActive: true
                }
            })
            .then(response => {
                expect(response.status).toBe(200);
            });
        }, 5000);
        
    });

    //add test case to check delivery schedule

    

});