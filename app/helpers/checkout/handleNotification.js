const logger = require('../../utils/logger');
const auth = require('basic-auth');

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
        return res.status(200).end();
    }
    
}

module.exports = handleNotification;