const SkinType = require('../../../models/SkinType');
const logger = require('../../../utils/logger');

function createSkinType (req, res, next) {
    const skinType = req.body.skinType;

    if (!skinType) {
        logger.error(`createSkinType request has failed | missing parameter`);
        return res.status(400).json({
            status: 'failed',
            message: 'bad request'
        });
    }

    if (skinType) {
        const newSkinType = new SkinType();
        newSkinType.skinType = skinType;
        newSkinType.skinTypeCode = newSkinType.setSkinTypeCode(newSkinType.skinType);
        newSkinType.save()
        .then((skinType) => {
            if (skinType) {
                logger.info(`createSkinType request has processed | ${newSkinType.skinType} has created`);
                return res.status(201).json({
                    status: 'success',
                    message: 'new skinType created'
                });
            }
        }).catch(next);
    }
}

module.exports = createSkinType;