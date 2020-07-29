const lookupService = require('./service');
const logger = require('../../../../../../_shared/logger');

let addressLookup = {};

addressLookup.getAddressDetail = async (req, res, next) => {

    const countryCode = req.body.countryCode;
    const addressInfo = req.body.address;

    if (!countryCode || ! addressInfo) {
        logger.warn(`addressLookup request has rejected as param is missing`);
        return res.status(400).json({
            status: "fail",
            message: "bad request"
        });
    }

    try {
        const result = await lookupService.lookupAddress(countryCode, addressInfo);
        logger.info(`addressLookup endpoint returned result`);
        return res.status(200).json(result);
    } catch (exception) {
        if (exception.result === "error") {
            logger.info(`addressLookup endpoint failed: ${exception.error}`);
            return res.status(422).json(exception);
        } else {
            next(exception);
        } 
    } 
};

module.exports = addressLookup;


