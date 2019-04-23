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
        const eventCode = req.body.notificationItems[0].NotificationRequestItem.eventCode;
        const orderNumber = req.body.notificationItems[0].NotificationRequestItem.merchantReference;
        const isSuccess = req.body.notificationItems[0].NotificationRequestItem.success;

        if (eventCode === "AUTHORISATION" && isSuccess === "true") {

            Order.findOne({ orderNumber: orderNumber })
            .then((order) => {
                // AUTHORISATION event can only update payment status
                // when previous status is OPEN or PENDING
                if (order && 
                    (order.paymentStatus.status === "OPEN" ||
                    order.paymentStatus.status === "PENDING")
                    ) {

                    const paymentStatusUpdate = { status: 'AUTHORIZED' };
                    const orderStatusUpdate = { status: 'PAID' };

                    // update payment status and order status
                    order.paymentStatus = paymentStatusUpdate;
                    order.paymentHistory.push(order.paymentStatus);
                    order.orderStatus = orderStatusUpdate;
                    order.orderStatusHistory.push(order.orderStatus);

                    // markModieifed to update existing document in DB
                    order.markModified(paymentStatus);
                    order.markModified(paymentHistory);
                    order.markModified(orderStatus);
                    order.markModified(orderStatusHistory);

                    // save updated document
                    order.save().then((order) => {
                        logger.info(`${order.orderNumber} | order status updated to AUTHORIZED and payment status updated to PAID`);
                        return res.status(200).end("[accepted]");
                    })
                    .catch(next);

                    
                } else {
                    // cannnot find matching order
                    logger.warn(`Adyen merchant ref: ${orderNumber} | cannot found orderNumber from Adyen merchant ref`);
                    return res.status(422).end("[accepted]");
                }
            })
            .catch(next);            
        }

        if (eventCode === "AUTHORISATION" && isSuccess === "false") {
            
            return res.status(200).end("[accepted]");
        }
        
    }
    
}

module.exports = handleNotification;