const buildSerializer = require('../../_shared/serializerBuilder');

const _serializeSingleObjEnty = (category) => {
    return {
        _id: category._id,
        categoryName: category.categoryName,
        categoryCode: category.categoryCode
    };
};

module.exports = buildSerializer(_serializeSingleObjEnty);