const logger = require('../../utils/logger');
const auth = require('basic-auth');
const Order = require('../../models/Order');

function handleNotification (req, res, next) {
    const credentials = auth(req);
    console.log(credentials);

    if (!credentials || 
        credentials.name !== 'chokchok-test' ||
        credentials.pass !== 'thisistestendpoint') {
            logger.warn('payment notification is requested with invalid basic auth header');
            res.set({ 'WWW-Authenticate': 'Basic realm="notification"' });
            return res.status(401).json({ message: 'unauthorized request' });
            
    } else {
        // process notification
        console.log(req.body.notificationItems);
        const eventCode = req.body.notificationItems[0].NotificationRequestItem.eventCode;
        console.log(eventCode);
        const orderNumber = req.body.notificationItems[0].NotificationRequestItem.merchantReference;
        console.log(orderNumber);
        const isSuccess = req.body.notificationItems[0].NotificationRequestItem.success;
        console.log(isSuccess);

        if (eventCode === "AUTHORISATION" && isSuccess === "true") {

            Order.findOne({ orderNumber: orderNumber })
            .then((order) => {
                // AUTHORISATION event can only update payment status
                // when previous status is OPEN or PENDING
                
                if (order) {
                    const paymentStatusUpdate = { status: 'AUTHORIZED' };
                    const orderStatusUpdate = { status: 'PAID' };

                    if ((order.paymentStatus.status === "OPEN" ||
                        order.paymentStatus.status === "PENDING")) {
                        // payment status is only updated to AUTHORIZED
                        // when prev status is OPEN or PENDING
                        order.paymentStatus = paymentStatusUpdate;
                        order.markModified('paymentStatus');
                        // order status and history in only updated to PAID
                        // when prev payment status is OPEN or PENDING
                        order.orderStatus = orderStatusUpdate;
                        order.orderStatusHistory.push(order.orderStatus);
                        order.markModified('orderStatus');
                        order.markModified('orderStatusHistory');
                    }

                    // update payment status history
                    // when payment status update didn't changed payment status
                    // history is still saved for debugging purposes
                    order.paymentHistory.push(paymentStatusUpdate);
                    order.markModified('paymentHistory');
                    
                    // save updated document
                    order.save().then((order) => {
                        logger.info(`${order.orderNumber} | order status updated to AUTHORIZED and payment status updated to PAID`);
                        return res.status(200).end("[accepted]");
                    }).catch(next);

                    
                } else {
                    // cannnot find matching order
                    logger.warn(`Adyen merchant ref: ${orderNumber} | cannot found orderNumber from Adyen merchant ref`);
                    return res.status(422).end();
                }
            })
            .catch(next);            
        }

        if (eventCode === "AUTHORISATION" && isSuccess === "false") {

            const failedReason = req.body.notificationItems[0].NotificationRequestItem.reason;

            if (failedReason === "REFUSED") {
                Order.findOne({ orderNumber: orderNumber })
                .then((order) => {

                    if (order) {
                        const paymentStatusUpdate = { status: 'REFUSED' };
                        const orderStatusUpdate = { status: 'OVERDUE' };

                        if ((order.paymentStatus.status === "OPEN" ||
                            order.paymentStatus.status === "PENDING"
                        )) {
                            // payment status is only updated to REFUSED
                            // when prev status is OPEN or PENDING
                            order.paymentStatus = paymentStatusUpdate;
                            order.markModified('paymentStatus');   
                            // order status and history is only updated to OVERDUE
                            // when prev payment status is OPEN or PENDING
                            order.orderStatus = orderStatusUpdate;
                            order.orderStatusHistory.push(order.orderStatus);
                            order.markModified('orderStatus');
                            order.markModified('orderStatusHistory');s
                        }
                        // update payment status history
                        // when payment status update didn't changed payment status
                        // history is still saved for debugging purposes
                        order.paymentHistory.push(paymentStatusUpdate);
                        order.markModified('paymentHistory');

                        // save updated document
                        order.save().then((order) => {
                            logger.info(`${order.orderNumber} | order status updated to OVERDUE and payment status updated to REFUSED`);
                            return res.status(200).end("[accepted]");
                        }).catch(next);

                    } else {

                        // cannnot find matching order
                        logger.warn(`Adyen merchant ref: ${orderNumber} | cannot found orderNumber from Adyen merchant ref`);
                        return res.status(422).end();

                    }
                })
                .catch(next);
            } else {
                // unhandled auth fail reason
                logger.warn(`Adyen mercahnt ref: ${orderNumber} | unhandled failedReason: ${failedReason}`);
                return res.status(501).end("[accepted]");
            }
            
        }
        
    }
    
}

module.exports = handleNotification;