const buildSerializer = require('../../_shared/serializerBuilder');

const _serializeSingleObjEntry = (adminUser) => {
    return {
        _id: adminUser._id,

    };
};

module.exports = buildSerializer(_serializeSingleObjEntry);