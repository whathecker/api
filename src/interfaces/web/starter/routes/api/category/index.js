const categoryDB = require('../../../../../../infra/data-access/category-db');
const logger = require('../../../../../_shared/logger');

let category = {};

category.listCategories = async (req, res, next) => {
    try {
        const categories = await categoryDB.listCategories();
        logger.info(`list categories endpoint has processed and returned categories`);
        
        return res.status(200).json({
            status: "success",
            categories: categories
        });
    }
    catch (err) {
        next(err);
    }
};

category.createCategory = (req, res, next) => {
    return res.status(200).end();
};

module.exports = category;