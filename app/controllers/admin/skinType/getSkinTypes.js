const SkinType = require('../../../models/SkinType');
const logger = require('../../../utils/logger');

function getSkinType (req, res, next) {
    SkinType.find()
    .then((skinTypes) => {
        logger.info(`getSkinTypes endpoint has processed and returned categoreis`);
        return res.status(200).json({
            status: 'success',
            skinTypes: skinTypes
        });
    }).catch(next);
}

module.exports = getSkinType;