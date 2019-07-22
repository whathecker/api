const Brand = require('../../../models/Brand');
const logger = require('../../../utils/logger');

function getBrands (req, res, next) {
    Brand.find()
    .then((brands) => {
        logger.info(`getBrands endpoint has processed and returned categoreis`);
        return res.status(200).json({
            status: 'success',
            brands: brands
        });
    }).catch(next);
}

module.exports = getBrands;