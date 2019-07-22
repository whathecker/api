const Category = require('../../../models/Category');
const logger = require('../../../utils/logger');

function getCategories (req, res, next) {
    Category.find()
    .then((categoreis) => {
        logger.info(`getCategories endpoint has processed and returned categoreis`);
        return res.status(200).json({
            status: 'success',
            categories: categoreis
        });
    }).catch(next);
}

module.exports = getCategories;