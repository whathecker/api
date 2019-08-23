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

module.exports = apikeyInterfaces;