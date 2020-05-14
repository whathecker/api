const categoryDB = require('../../../../../../infra/data-access/category-db');

let category = {};

category.list = (req, res, next) => {
    return res.status(200).end();
};

category.create = (req, res, next) => {
    return res.status(200).end();
};

module.exports = category;