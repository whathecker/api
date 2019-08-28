const logger = require('../../utils/logger');
const modelInterface = require('../../utils/model-interface');

function createApikey (req, res, next) {

    if (!req.body.name) {
        logger.warn(`createApikey request has failed - bad request`);
        return res.status(400).json({
            status: 'failed',
            message: 'bad request' 
        });
    }

    const apikey = modelInterface.apikey.createApikeyInstance({
        name: req.body.name
    });

    apikey.save().then((apikey)=> {
        logger.info(`createApikey request is successfully created, key: ${apikey.key}`);
        return res.status(201).json({ 
            status: 'success',
            key: apikey,
            message: 'apikey has created' 
        });
    }).catch(next);

}

module.exports = createApikey;

