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
    catch (exception) {
        next(exception);
    }
};

category.createCategory = async (req, res, next) => {
    const categoryName = req.body.categoryName;
    const categoryCode = req.body.categoryCode;

    if (!categoryName || ! categoryCode) {
        logger.error(`createCategory request has failed | missing parameter`);
        return res.status(400).json({
            status: 'fail',
            message: 'bad request'
        });
    }

    try {
        const payload = {
            categoryName: categoryName,
            categoryCode: categoryCode
        };
        const category = await categoryDB.addCategory(payload);
        logger.info(`createCategory request has created new category | name: ${category.categoryName} code: ${category.categoryCode}`);
        return res.status(201).json({
            status: 'success',
            message: 'new category created'
        });

    } catch (exception) {
        if (exception.status === "fail") {
            logger.error(`createCategory request has failed | error: ${exception.error.message}`);
            return res.status(422).json({
                status: "fail",
                message: exception.error.message
            })
        } else {
            next(exception);
        }
    }
};

module.exports = category;