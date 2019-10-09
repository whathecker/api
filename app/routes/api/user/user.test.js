const app = require('../../../app');
const session = require('supertest-session');
const testHelpers = require('../../../utils/test/testHelpers');

let apikey = null;
let products = null;
let addresses = null;
let boxes = null;
let createdOrder =  null;
let createdSubscription = null;

describe('Test user endpoints', () => {
    const testSession = session(app);

    beforeAll(() => {

        return Promise.all([
            testHelpers.createTestApikey(),
            testHelpers.createTestProducts()
        ])
        .then(values => {

            apikey = values[0];
            products = values[1];

            return testHelpers.createTestSubscriptionBoxes(products)
            .then(boxes => {
                // assign value for subsequent testings
                boxes = boxes;

                return testHelpers.createTestSubscribedUser(boxes)
                .then(result => {
                    
                    addresses = result.user.addresses;
                    createdOrder = result.order;
                    createdSubscription = result.subscription;

                    // login user
                    return testSession.post('/user/login')
                    .set('X-API-Key', apikey)
                    .send({
                        email: testHelpers.dummyUserDetail.email,
                        password: testHelpers.dummyUserDetail.password
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
            testHelpers.removeTestApikeys(),
            testHelpers.removeTestProducts(),
            testHelpers.removeTestSubscriptionBoxes(),
            testHelpers.removeTestSubscribedUser(),
            testHelpers.removeTestPauseReason(),
        ]);
    });

    test('getUserDetail success', () => {
        return testSession.get('/user')
        .set('X-API-Key', apikey)
        .then(response => {
            const user = response.body;
            expect(response.status).toBe(200);
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('firstName');
            expect(user).toHaveProperty('lastName');
            expect(user).toHaveProperty('mobileNumber');
            expect(user).toHaveProperty('address');
            expect(user.address).toHaveProperty('streetName');
            expect(user.address).toHaveProperty('houseNumber');
            expect(user.address).toHaveProperty('houseNumberAdd');
            expect(user.address).toHaveProperty('city');
            expect(user.address).toHaveProperty('province');
            expect(user.address).toHaveProperty('country');
            expect(user).toHaveProperty('subscription');
            expect(user.subscription).toHaveProperty('id');
            expect(user.subscription).toHaveProperty('deliveryFrequency');
            expect(user.subscription).toHaveProperty('delivertyDay');
            expect(user.subscription).toHaveProperty('nextDelivery');
            expect(user).toHaveProperty('subscribedItems');
            expect(user.subscribedItems[0]).toHaveProperty('id');
            expect(user.subscribedItems[0]).toHaveProperty('boxType');
            expect(user.subscribedItems[0]).toHaveProperty('quantity');
            expect(user).toHaveProperty('billingOptions');
        });
    });

    test('getUserSubscription success', () => {
        return testSession.get('/user/subscription')
        .set('X-API-Key', apikey)
        .then(response => {
            const subscription = response.body.subscription;
            expect(response.status).toBe(200);
            expect(subscription).toHaveProperty('channel');
            expect(subscription).toHaveProperty('deliveryFrequency');
            expect(subscription.deliveryFrequency).toBe(28);
            expect(subscription).toHaveProperty('deliveryDay');
            expect(subscription.deliveryDay).toBe(4)
            expect(subscription).toHaveProperty('isActive');
            expect(subscription.isActive).toBe(true);
            expect(subscription).toHaveProperty('deliverySchedules');
            expect(subscription).toHaveProperty('subscriptionId');
        });
    });

    describe('address related endpoints', () => {

        test('getUserAddresses success', () => {
            return testSession.get('/user/addresses')
            .set('X-API-Key', apikey)
            .then(response => {
                const address = response.body;
                const shippingAddress = testHelpers.dummyUserDetail.shippingAddress;
                const billingAddress = testHelpers.dummyUserDetail.billingAddress;
                expect(response.status).toBe(200);
                expect(address).toHaveProperty('addresses');
                expect(address.addresses).toHaveLength(2);
                expect(address).toHaveProperty('shippingAddress');
                expect(address.shippingAddress.firstName).toBe(shippingAddress.firstName);
                expect(address.shippingAddress.lastName).toBe(shippingAddress.lastName);
                expect(address.shippingAddress.postalCode).toBe(shippingAddress.postalCode);
                expect(address.shippingAddress.houseNumber).toBe(shippingAddress.houseNumber);
                expect(address.shippingAddress.houseNumberAdd).toBe(shippingAddress.houseNumberAdd);
                expect(address.shippingAddress.mobileNumber).toBe(shippingAddress.mobileNumber);
                expect(address.shippingAddress.streetName).toBe(shippingAddress.streetName);
                expect(address.shippingAddress.city).toBe(shippingAddress.city);
                expect(address.shippingAddress.province).toBe(shippingAddress.province);
                expect(address.shippingAddress.country).toBe(shippingAddress.country);
                expect(address).toHaveProperty('billingAddress');
                expect(address.billingAddress.firstName).toBe(billingAddress.firstName);
                expect(address.billingAddress.lastName).toBe(billingAddress.lastName);
                expect(address.billingAddress.postalCode).toBe(billingAddress.postalCode);
                expect(address.billingAddress.houseNumber).toBe(billingAddress.houseNumber);
                expect(address.billingAddress.houseNumberAdd).toBe(billingAddress.houseNumberAdd);
                expect(address.billingAddress.mobileNumber).toBe(billingAddress.mobileNumber);
                expect(address.billingAddress.streetName).toBe(billingAddress.streetName);
                expect(address.billingAddress.city).toBe(billingAddress.city);
                expect(address.billingAddress.province).toBe(billingAddress.province);
                expect(address.billingAddress.country).toBe(billingAddress.country);
                
            });
        });
    
        test('upsertAddress success - existing address', () => {
            return testSession.put('/user/addresses/address')
            .set('X-API-Key', apikey)
            .send({
                id: addresses[0]._id,
                city: addresses[0].city,
                province: addresses[0].province,
                country: addresses[0].country,
                streetName: addresses[0].streetName,
                houseNumber: '100',
                houseNumberAdd: addresses[0].houseNumberAdd,
                postalCode: '1095TV',
                firstName: addresses[0].firstName,
                lastName: addresses[0].lastName,
                mobileNumber: addresses[0].mobileNumber
            })
            .then(response => {
                expect(response.status).toBe(200);
            });
        });
    
        test('upsertAddress success - new address', () => {
            return testSession.put('/user/addresses/address')
            .set('X-API-Key', apikey)
            .send({
                city: 'Leiden',
                province: addresses[0].province,
                country: addresses[0].country,
                streetName: addresses[0].streetName,
                houseNumber: '100',
                houseNumberAdd: addresses[0].houseNumberAdd,
                postalCode: '1095TV',
                firstName: addresses[0].firstName,
                lastName: addresses[0].lastName,
                mobileNumber: addresses[0].mobileNumber
            })
            .then(response => {
                expect(response.status).toBe(201);
            });
        });
    
        test('getUserAddresses success - check if new address has added', () => {
            return testSession.get('/user/addresses')
            .set('X-API-Key', apikey)
            .then(response => {
                const address = response.body;
                expect(response.status).toBe(200);
                expect(address).toHaveProperty('addresses');
                expect(address.addresses).toHaveLength(3);
            });
        });
    
        test('deleteAddress fail - cannot delete default address', () => {
            // 1st element in addresses array is either default billing or shipping
            return testSession.delete(`/user/addresses/address/${addresses[0]._id}`)
            .set('X-API-Key', apikey)
            .then(response => {
                expect(response.status).toBe(422);
            });
        });
    
        test('deleteAddress success', () => {
            return testSession.get('/user/addresses')
            .set('X-API-Key', apikey)
            .then(response => {
                const address = response.body;
                return testSession.delete(`/user/addresses/address/${address.addresses[address.addresses.length - 1].id}`)
                .set('X-API-Key', apikey)
                .then(response => {
                    expect(response.status).toBe(200);
                });
            });
        });
    
        test('getAddresses success - length is 2', () => {
            return testSession.get('/user/addresses')
            .set('X-API-Key', apikey)
            .then(response => {
                const address = response.body;
                expect(address.addresses).toHaveLength(2);
            });
        });
    });

    describe('contact detail related endpoints', () => {

        test('updateContactDetail fail - bad request', () => {
            return testSession.put('/user/contact')
            .set('X-API-Key', apikey)
            .send({})
            .then(response => {
                expect(response.status).toBe(400);
            });
        });

        test('updateContactDetail success', () => {
            return testSession.put('/user/contact')
            .set('X-API-Key', apikey)
            .send({
                firstName: 'updated',
                lastName: 'updated',
                mobileNumber: ' '
            })
            .then(response => {
                expect(response.status).toBe(200);
            });
        });

        test('updateEmailAddress fail - bad request', () => {
            return testSession.put('/user/email')
            .set('X-API-Key', apikey)
            .send({})
            .then(response => {
                expect(response.status).toBe(400);
            });
        });

        test('updateEmailAddress fail - invalid password', () => {
            return testSession.put('/user/email')
            .set('X-API-Key', apikey)
            .send({
                email: testHelpers.dummyUserDetail.email,
                password: 'fakepassword',
                newEmail: 'yunjae.oh.kr@gmail.com'
            })
            .then(response => {
                expect(response.status).toBe(403);
            });
        });

        test('updateEmailAddress fail - duplicated email', () => {
            return testSession.put('/user/email')
            .set('X-API-Key', apikey)
            .send({
                email: testHelpers.dummyUserDetail.email,
                password: testHelpers.dummyUserDetail.password,
                newEmail: 'yunjae.oh.nl@gmail.com'
            })
            .then(response => {
                expect(response.status).toBe(422);
            });
        });

        test('updateEmailAddress success', () => {
            return testSession.put('/user/email')
            .set('X-API-Key', apikey)
            .send({
                email: testHelpers.dummyUserDetail.email,
                password: testHelpers.dummyUserDetail.password,
                newEmail: 'yunjae.oh.kr@gmail.com'
            })
            .then(response => {
                expect(response.status).toBe(200);
            });
        });

        test('updatePassword request fail - bad request', () => {
            return testSession.put('/user/password')
            .set('X-API-Key', apikey)
            .send({})
            .then(response => {
                expect(response.status).toBe(400);
            });
        });

        test('updatePassword request fail - invalid password', () => {
            return testSession.put('/user/password')
            .set('X-API-Key', apikey)
            .send({
                password: 'invalid',
                newPassword: 'newpassword'
            })
            .then(response => {
                expect(response.status).toBe(403);
            });
        });

        test('updatePassword request success', () => {
            return testSession.put('/user/password')
            .set('X-API-Key', apikey)
            .send({
                password: testHelpers.dummyUserDetail.password,
                newPassword: 'thisisnewpassword'
            })
            .then(response => {
                expect(response.status).toBe(200);
            });
        });

    });

    describe('order related endpoints,', () => {

        test('getUserOrders success', () => {
            return testSession.get('/user/orders')
            .set('X-API-Key', apikey)
            .then(response => {
                expect(response.status).toBe(200);
                expect(response.body.orders.length).toBeGreaterThan(0);
            });
        });

        test('getUserInvoice success', () => {
            return testSession.get(`/user/orders/order/${createdOrder.orderNumber}/invoice`)
            .set('X-API-Key', apikey)
            .then(response => {
                expect(response.status).toBe(200);
            });
        });

    });
        

    describe('updatePackage endpoint', () => {

        test('updatePackage fail - bad request', () => {
            return testSession.put('/user/subscription/package')
            .set('X-API-Key', apikey)
            .send({})
            .then(response => {
                expect(response.status).toBe(400);
            });
        });

        test('updatePackage fail - invalid boxType', () => {
            return testSession.put('/user/subscription/package')
            .set('X-API-Key', apikey)
            .send({
                boxType: 'oilyhy'
            })
            .then(response => {
                expect(response.status).toBe(422);
            });
        });

        test('updatePackage success', () => {
            return testSession.put('/user/subscription/package')
            .set('X-API-Key', apikey)
            .send({
                boxType: 'oily'
            })
            .then(response => {
                expect(response.status).toBe(200);
            });
        });

    });

    describe('updateDeliverySchedules endpoint', () => {

        test('updateDeliverySchedules fail - bad request', () => {
            return testSession.put('/user/subscription/delivery')
            .set('X-API-Key', apikey)
            .send({})
            .then(response => {
                expect(response.status).toBe(400);
            });
        });

        test('updateDeliverySchedules fail - incorrect subscription id', () => {
            return testSession.put('/user/subscription/delivery')
            .set('X-API-Key', apikey)
            .send({
                subscription: {
                    subscriptionId: 'DBSG10101343',
                    deliveryFrequency: 'Weekly',
                    isActive: true
                }
            })
            .then(response => {
                expect(response.status).toBe(422);
            });
        });

        test('updateDeliverySchedules success', () => {
            return testSession.put('/user/subscription/delivery')
            .set('X-API-Key', apikey)
            .send({
                subscription: {
                    subscriptionId: createdSubscription.subscriptionId,
                    deliveryFrequency: 'Weekly',
                    isActive: true
                }
            })
            .then(response => {
                expect(response.status).toBe(200);
            });
        });

        test('getUserSubscription success', () => {
            return testSession.get('/user/subscription')
            .set('X-API-Key', apikey)
            .then(response => {

                const subscription = response.body.subscription;

                expect(response.status).toBe(200);
                expect(subscription.deliveryFrequency).toBe(7);
                expect(subscription.deliverySchedules).toHaveLength(2);

            });
        });

    });

    describe('updateSubscriptionStatus endpoint', () => {

        test('updateDeliverySchedules fail - bad request', () => {
            return testSession.put('/user/subscription/status')
            .set('X-API-Key', apikey)
            .send({})
            .then(response => {
                expect(response.status).toBe(400);
            });
        });

        test('updateDeliverySchedules fail - incorrect subscription id', () => {
            return testSession.put('/user/subscription/status')
            .set('X-API-Key', apikey)
            .send({
                subscription: { subscriptionId: 'DBSG10101343' }
            })
            .then(response => {
                expect(response.status).toBe(422);
            });
        });

        test('updateDeliverySchedules success - inactive subscription', () => {
            return testSession.put('/user/subscription/status')
            .set('X-API-Key', apikey)
            .send({
                subscription: { subscriptionId: createdSubscription.subscriptionId }
            })
            .then(response => {
                expect(response.status).toBe(200);
            });
        });

        test('updateDeliverySchedules success - active subscription', () => {
            setTimeout(() => {
                return testSession.put('/user/subscription/status')
                .set('X-API-Key', apikey)
                .send({
                    subscription: { subscriptionId: createdSubscription.subscriptionId }
                })
                .then(response => {
                    expect(response.status).toBe(200);
                });
            }, 5000);
        });
    });
    
});