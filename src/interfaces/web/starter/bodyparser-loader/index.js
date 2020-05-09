const bodyParser = require('body-parser');

const enableParseOfUrlEncodedReqBody = () => {
    return bodyParser.urlencoded({ extended: true });
};

const enableParseOfJsonReqBody = (req, res, buf) => {
    return bodyParser.json({
        verify: convertWebhookReqBodyToBuffer(req, res, buf)
    });
};

function convertWebhookReqBodyToBuffer (req, res, buf) {
    console.log(req);
    const url = req.originalUrl;
    if (url.startsWith('/checkout/payment/hook')) {
        req.rawBody = buf.toString();
    }
}

module.exports = {
    enableParseOfUrlEncodedReqBody,
    enableParseOfJsonReqBody
};