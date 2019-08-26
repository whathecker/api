const app = require('../../../app');
const session = require('supertest-session');
const testHelpers = require('../../../utils/test/testHelpers');

let apikey = null;
let createdOrder = null;

describe('Test order endpoints', () => {
    const testSession = session(app);

    beforeAll(() => {
        
        return Promise.all([
            testHelpers.createTestApikey(),
            testHelpers.createTestAdminUser(),
            testHelpers.createTestProducts(),
        ])
        .then(values => {
            apikey = values[0],
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

    // updateShippingItems
    // removePackedItems
    // updateShippingStatus

});