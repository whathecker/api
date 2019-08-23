const Category = require('../../../models/Category');

const categoryInterfaces = {};

/**
 * private method: createBrandInstance
 * @param {object} categoryDetail:
 * object contain categoryName and categoryCode field
 * 
 * Return: new instance of Category model
 */

categoryInterfaces.createCategoryInstance = (categoryDetail) => {
    
    if (!categoryDetail) {
        throw new Error('Missing argument: cannnot create Brand instance without categoryDetail argument');
    }

    const category = new Category();
    category.categoryName = categoryDetail.categoryName;
    category.categoryCode = categoryDetail.categoryCode;

    return category;
}

module.exports = categoryInterfaces;