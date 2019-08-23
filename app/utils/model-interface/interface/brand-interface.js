const Brand = require('../../../models/Brand');

const brandInterfaces = {};

/**
 * public method: createBrandInstance
 * @param {object} brandDetail:
 * object contain brandName and brandCode field
 * 
 * Return: new instance of Brand model
 */

brandInterfaces.createBrandInstance = (brandDetail) => {
    if (!brandDetail) {
        throw new Error('Missing argument: cannnot create Brand instance without brandDetail argument');
    }

    const brand = new Brand();
    brand.brandName = brandDetail.brandName;
    brand.brandCode = brandDetail.brandCode;
    return brand;
}
module.exports = brandInterfaces;