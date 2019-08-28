const logger = require('../../utils/logger');
const modelInterface = require('../../utils/model-interface');

function deleteApikey (req, res, next) {

    const key_id = req.params.key_id;

    modelInterface.apikey.removeApikeyByDbId(key_id)
    .then(result => {
        
        if (!result) { 
            logger.warn('deleteApikey request has rejected as key is unknown')
            return res.status(422).json({ 
                status: 'failed',
                message: 'unknown key_id'
            }); 
        }
        if (result) {
            logger.info('deleteApikey request has succeed');
            return res.status(200).json({ 
                status: 'success',
                message: 'apikey has removed' 
            });
        }
        
    })
    .catch(next);
}

module.exports = deleteApikey;