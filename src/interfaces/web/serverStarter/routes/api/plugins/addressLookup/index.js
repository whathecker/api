const lookupService = require('./service');
const logger = require('../../../../../../_shared/logger');

let addressLookup = {};

addressLookup.getAddressDetail = async (req, res, next) => {
    try {
        const countryCode = req.body.countryCode;
        const addressInfo = req.body.address;
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


