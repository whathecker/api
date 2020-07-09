const skinTypeDB = require('../../../../../../infra/data-access/skinType-db');
const logger = require('../../../../../_shared/logger');

let skinType = {};

skinType.listSkinTypes = async (req, res, next) => {
    try {
        const skinTypes = await skinTypeDB.listSkinTypes();
        logger.info(`listSkinTypes endpoint has processed and returned skinTypes`);

        return res.status(200).json({
            status: "success",
            skinTypes: skinTypes
        });
    }
    catch (exception) {
        next(exception);
    }
};

skinType.createSkinType = async (req, res, next) => {
    const skinType = req.body.skinType;
    const skinTypeCode = req.body.skinTypeCode;

    if (!skinType || !skinTypeCode) {
        logger.error(`createSkinType request has failed | missing parameter`);
        return res.status(400).json({
            status: 'fail',
            message: 'bad request'
        });
    }

    try {
        const payload = {
            skinType: skinType,
            skinTypeCode: skinTypeCode
        };
        const newSkinType = await skinTypeDB.addSkinType(payload);
        logger.info(`createSkinType request has created new skinType | name: ${newSkinType.skinType} code: ${newSkinType.skinTypeCode}`);
        return res.status(201).json({
            status: 'success',
            message: 'new skinType created'
        });
    }
    catch (exception) {
        if (exception.status === "fail") {
            logger.error(`createSkinType request has failed | error: ${exception.error.message}`);
            return res.status(422).json({
                status: "fail",
                message: exception.error.message
            });
        } else {
            next(exception);
        }
    }
};

module.exports = skinType;