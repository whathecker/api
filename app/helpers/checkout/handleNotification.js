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

        if (eventCode === "AUTHORISATION" && isSuccess) {
            // handle authorizsation
            return res.status(200).end("[accepted]");
        }
        
    }
    
}

module.exports = handleNotification;