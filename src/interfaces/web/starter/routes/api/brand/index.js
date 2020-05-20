const brandDB = require('../../../../../../infra/data-access/brand-db');
const logger = require('../../../../../_shared/logger');

let brand = {};

brand.listBrands = async (req, res, next) => {
    return res.status(200).end();
};

brand.createBrand = async (req, res, next) => {
    return res.status(200).end();
};

module.exports = brand;