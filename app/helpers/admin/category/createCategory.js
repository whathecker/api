const Category = require('../../../models/Category');
const logger = require('../../../utils/logger');

function createCategory (req, res, next) {
    const categoryName = req.body.categoryName;
    const categoryCode = req.body.categoryCode;

    if (!categoryName || !categoryCode) {
        logger.error(`createCategory request has failed | missing parameter`);
        return res.status(400).json({
            status: 'failed',
            message: 'bad request'
        });
    }

    if (categoryName && categoryCode) {
        const newCategory = new Category();
        newCategory.categoryName = categoryName;
        newCategory.categoryCode = categoryCode;
        newCategory.save()
        .then((category) => {
            if (category) {
                return res.status(201).json({
                    status: 'success',
                    message: 'new category created'
                });
            }
        }).catch(next);
    }
}

module.exports = createCategory;