const Brand = require('../../../models/Brand');
const logger = require('../../../utils/logger');

function createBrand (req, res, next) {
    const brandName = req.body.brandName;
    const brandCode = req.body.brandCode;
    if (!brandCode || !brandName) {
        logger.error(`createBrand request has failed | missing parameter`);
        return res.status(400).json({
            status: 'failed',
            message: 'bad request'
        });
    }

    if (brandCode && brandName) {
        const newBrand = new Brand();
        newBrand.brandCode = brandCode.toUpperCase();
        newBrand.brandName = brandName;
        newBrand.save()
        .then((brand) => {
            if (brand) {
                return res.status(201).json({
                    status: 'success',
                    message: 'new brand created'
                });
            }
        }).catch(next);
    }
}

module.exports = createBrand;