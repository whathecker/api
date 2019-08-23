const Apikey = require('../../../models/Apikey');

const apikeyInterfaces = {};

/**
 * public method: createApikeyInstance
 * @param {object} apikeyDetail:
 * object contain name field
 * 
 * Return: new instance of Apikey model
 */

apikeyInterfaces.createApikeyInstance = (apikeyDetail) => {
    if (!apikeyDetail) {
        throw new Error('Missing argument: cannnot create Apikey instance without apikeyDetail argument');
    }
    const apikey = new Apikey();
    apikey.name = apikeyDetail.name;
    apikey.key = apikey.createApikey();
    return apikey;
}

/**
 * public method: removeApikeyByDbId
 * @param {String} key_id: mongodb object_id of Apikey model
 * 
 * Return: Promise
 * When Apikey is removed resolve with removed Apikey
 * When Apikey is unknown resolve without value
 * When Error is thrown while removing, reject the promise
 */
apikeyInterfaces.removeApikeyByDbId = (key_id) => {

    if (!key_id) {
        throw new Error('Missing argument: cannot remove Apikey instance without key_id argument');
    }

    return new Promise((resolve, reject) => {
        Apikey.findOneAndRemove({ _id: key_id })
        .then(key => {

            !key? resolve() : null;
            key? resolve(key) : null;
            
        })
        .catch(error => {
            reject(error);
        });
    })
    
}

module.exports = apikeyInterfaces;