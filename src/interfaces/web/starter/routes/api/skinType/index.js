const skinTypeDB = require('../../../../../../infra/data-access/skinType-db');
const logger = require('../../../../../_shared/logger');

let skinType = {};

skinType.listSkinTypes = async (req, res, next) => {
    return res.status(200).end();
};

skinType.createSkinType = async (req, res, next) => {
    return res.status(200).end();
};

module.exports = skinType;