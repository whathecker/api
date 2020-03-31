let buildCreateOrderObj = function(orderValidator) {
    return ({
    } = {}) => {
        
        const result = orderValidator();

        if (result instanceof Error) {
            return result;
        }
        return "return order object";
    }
}

module.exports = buildCreateOrderObj;