const brandDB = require('../../../../../../infra/data-access/brand-db');
const logger = require('../../../../../_shared/logger');

let brand = {};

brand.listBrands = async (req, res, next) => {
    try {
        const brands = await brandDB.listBrands();
        logger.info(`listBrands endpoint has processed and returned brands`);

        return res.status(200).json({
            status: "success",
            brands: brands
        });
    }
    catch (exception) {
        next(exception);
    }
};

brand.createBrand = async (req, res, next) => {
    const brandName = req.body.brandName;
    const brandCode = req.body.brandCode;

    if (!brandCode || !brandName) {
        logger.error(`createBrand request has failed | missing parameter`);
        return res.status(400).json({
            status: 'fail',
            message: 'bad request'
        });
    }

    try {
        const payload = {
            brandName: brandName,
            brandCode: brandCode
        };
        const brand = await brandDB.addBrand(payload);
        logger.info(`createBrand request has created new brand | name: ${brand.brandName} code: ${brand.brandCode}`);
        return res.status(201).json({
            status: 'success',
            message: 'new brand created'
        });
    }
    catch (exception) {
        if (exception.status === "fail") {
            logger.error(`createBrand request has failed | error: ${exception.error.message}`);
            return res.status(422).json({
                status: "fail",
                message: exception.error.message
            })
        } else {
            next(exception);
        }
    }
};

module.exports = brand;