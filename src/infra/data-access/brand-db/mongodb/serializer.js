const buildSerializer = require('../../_shared/serializerBuilder');

const _serializeSingleObjEnty = (brand) => {
    return {
        _id: brand._id,
        brandName: brand.brandName,
        brandCode: brand.brandCode
    };
}

module.exports = buildSerializer(_serializeSingleObjEnty);