const app = require('../../../app');
const session = require('supertest-session');
const testHelpers = require('../../../utils/test/testHelpers');

let apikey = null;
let createdOrder = null;
let products = null;

describe('Test order endpoints', () => {
    const testSession = session(app);

    beforeAll(() => {
        
        return Promise.all([
            testHelpers.createTestApikey(),
            testHelpers.createTestAdminUser(),
            testHelpers.createTestProducts(),
        ])
        .then(values => {
            apikey = values[0];
            email = values[1].email;
            password = process.env.TEST_ADMIN_USER_PASSWORD;
            products = values[2];

            return testHelpers.createTestSubscriptionBoxes(products)
            .then(boxes => {

                return testHelpers.createTestSubscribedUser(boxes)
                .then(result => {

                    console.log(result);

                    createdOrder = result.order;

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

    // getOrders
    test('getOrders success - length is 1', () => {
        return testSession.get('/orders/')
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.orders.length).toBe(1);
        });
    });
    // getOrderByOrderNumber
    test('getOrderByOrdernumber fail - invalid orderNumber', () => {
        return testSession.get(`/orders/order/invalid`)
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(422);
        });
    });

    test('getOrderByOrdernumber success', () => {

        return testSession.get(`/orders/order/${createdOrder.orderNumber}`)
        .set('X-API-Key', apikey)
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.order.paymentStatus.status).toBe('AUTHORIZED');
            expect(response.body.order.orderStatus.status).toBe('PAID');

            // orderStatusHistory length should be 2 when order is just created
            expect(response.body.order.orderStatusHistory).toHaveLength(2);
            // paymentHistory length should be 2 when order is just created
            expect(response.body.order.paymentHistory).toHaveLength(2);

            expect(response.body.order).toHaveProperty('deliverySchedule');
            expect(response.body.order).toHaveProperty('invoiceNumber');
            expect(response.body.order).toHaveProperty('isSubscription');
            expect(response.body.order).toHaveProperty('isShipped');
            expect(response.body.order).toHaveProperty('trackingNumber');
            expect(response.body.order).toHaveProperty('creationDate');
            expect(response.body.order).toHaveProperty('lastModified');

            expect(response.body.order.orderAmountPerItem).toHaveLength(1);

            expect(response.body.order.orderAmount.totalAmount).toBe('24.95');
            expect(response.body.order.orderAmount.totalVat).toBe('4.33');
            expect(response.body.order.orderAmount.totalNetPrice).toBe('20.62');

        });
    });

    describe('Test updateShippingItems, removePackedItems, updateShippingStatus endpoints', () => {

        let updatedItems;

        beforeAll(() => {
            
            // enrich array of products instance with isChecked, qtyToShip fields
            return testHelpers.enrichProductsArray(products)
            .then(enrichedProducts => {
                updatedItems = enrichedProducts;
                return;
            })
        });

        test('updateShippingItems fail - bad request', () => {
            return testSession.put(`/orders/order/${createdOrder.orderNumber}/shipping/items`)
            .set('X-API-Key', apikey)
            .send({})
            .then(response => {
                expect(response.status).toBe(400);
            });
        });

        test('updateShippingItems fail - unknown ordernumber', () => {
            return testSession.put(`/orders/order/invalid/shipping/items`)
            .set('X-API-Key', apikey)
            .send({
                update: { items: updatedItems }
            })
            .then(response => {
                expect(response.status).toBe(422);
            });
        });

        test('updateShippingItems success - empty items', () => {
            return testSession.put(`/orders/order/${createdOrder.orderNumber}/shipping/items`)
            .set('X-API-Key', apikey)
            .send({
                update: { items: [] }
            })
            .then(response => {
                expect(response.status).toBe(200);
            });
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

        test('updateShippingItems fail - order already packed', () => {
            
            return testSession.put(`/orders/order/${createdOrder.orderNumber}/shipping/items`)
            .set('X-API-Key', apikey)
            .send({
                update: { items: updatedItems }
            })
            .then(response => {
                expect(response.status).toBe(422);
            });
        });

        test('removedPackedItems success - no change in packed items', () => {
            return testSession.delete(`/orders/order/${createdOrder.orderNumber}/shipping/items/item`)
            .set('X-API-Key', apikey)
            .then(response => {
                expect(response.status).toBe(200);
            });
        });

        test('getOrderByOrderNumber success - check no change is packed item', () => {
            return testSession.get(`/orders/order/${createdOrder.orderNumber}`)
            .set('X-API-Key', apikey)
            .then(response => {
                const order = response.body.order;
                expect(response.status).toBe(200);
                expect(order.shippedAmountPerItem).toHaveLength(3);
                expect(order.shippedAmount.totalAmount).toBe('60.00');
                expect(order.shippedAmount.totalVat).toBe('10.44');
                expect(order.shippedAmount.totalDiscount).toBe('0.00');
                expect(order.shippedAmount.totalNetPrice).toBe('49.56');
            });
        });

        test('removedPackedItems success - remove 1st item', () => {
            return testSession.delete(`/orders/order/${createdOrder.orderNumber}/shipping/items/${updatedItems[0].id}`)
            .set('X-API-Key', apikey)
            .then(response => {
                expect(response.status).toBe(200);
            });
        });

        test('getOrderByOrderNumber success - check order after removal of 1st item', () => {
            return testSession.get(`/orders/order/${createdOrder.orderNumber}`)
            .set('X-API-Key', apikey)
            .then(response => {
                const order = response.body.order;
                expect(response.status).toBe(200);
                expect(order.shippedAmountPerItem).toHaveLength(2);
                expect(order.shippedAmount.totalAmount).toBe('40.00');
                expect(order.shippedAmount.totalVat).toBe('6.96');
                expect(order.shippedAmount.totalDiscount).toBe('0.00');
                expect(order.shippedAmount.totalNetPrice).toBe('33.04');
            });
        });

        test('removedPackedItems success - remove 2nd item', () => {
            return testSession.delete(`/orders/order/${createdOrder.orderNumber}/shipping/items/${updatedItems[1].id}`)
            .set('X-API-Key', apikey)
            .then(response => {
                expect(response.status).toBe(200);
            });
        });

        test('getOrderByOrderNumber success - check order after removal of 2nd item', () => {
            return testSession.get(`/orders/order/${createdOrder.orderNumber}`)
            .set('X-API-Key', apikey)
            .then(response => {
                const order = response.body.order;
                expect(response.status).toBe(200);
                expect(order.shippedAmountPerItem).toHaveLength(1);
                expect(order.shippedAmount.totalAmount).toBe('20.00');
                expect(order.shippedAmount.totalVat).toBe('3.48');
                expect(order.shippedAmount.totalDiscount).toBe('0.00');
                expect(order.shippedAmount.totalNetPrice).toBe('16.52');
            });
        });

        test('removedPackedItems success - remove 3rd item', () => {
            return testSession.delete(`/orders/order/${createdOrder.orderNumber}/shipping/items/${updatedItems[2].id}`)
            .set('X-API-Key', apikey)
            .then(response => {
                expect(response.status).toBe(200);
            });
        });

        test('getOrderByOrderNumber success - check order after removal of 3rd item', () => {
            return testSession.get(`/orders/order/${createdOrder.orderNumber}`)
            .set('X-API-Key', apikey)
            .then(response => {
                const order = response.body.order;
                expect(response.status).toBe(200);
                expect(order.shippedAmountPerItem).toHaveLength(0);
                expect(order.shippedAmount.totalAmount).toBe('0');
                expect(order.shippedAmount.totalVat).toBe('0');
                expect(order.shippedAmount.totalDiscount).toBe('0');
                expect(order.shippedAmount.totalNetPrice).toBe('0');
            });
        });

        test('updateShippingStatus fail - bad request', () => {
            return testSession.put(`/orders/order/${createdOrder.orderNumber}/shipping`)
            .set('X-API-Key', apikey)
            .send({})
            .then(response => {
                expect(response.status).toBe(400);
            });
        });

        test('updateShippingStatus fail - no items are packed', () => {
            return testSession.put(`/orders/order/${createdOrder.orderNumber}/shipping`)
            .set('X-API-Key', apikey)
            .send({
                update: {
                    courier: 'DHL',
                    trackingNumber: ['1234']
                }
            })
            .then(response => {
                expect(response.status).toBe(422);
            });
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
                expect(subscription.deliverySchedules[0].orderNumber).not.toBe(createdOrder.orderNumber);
            });
        });

        test('getOrderByOrderNumber success - check shipping status', () => {
            return testSession.get(`/orders/order/${createdOrder.orderNumber}`)
            .set('X-API-Key', apikey)
            .then(response => {
                const order = response.body.order;
                expect(response.status).toBe(200);
                expect(order.courier).toBe('DHL');
                expect(order.isShipped).toBe(true);
                expect(order.orderStatus.status).toBe('SHIPPED');
                
            });
        });

    });

});