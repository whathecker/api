const buildSerializer = function (singleObjSerializeFunc) {
    return (data) => {
        
        if (!data) {
            return null;
        }

        if (Array.isArray(data)) {
            return data.map(singleObjSerializeFunc);
        }

        return singleObjSerializeFunc(data);
    }
}

module.exports = buildSerializer;