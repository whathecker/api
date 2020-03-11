const Joi = require('@hapi/joi');

function returnMappedErrorMsg (error) {
    let message = error.details.map(el => el.message).join('\n');
    
    return {
        error: message
    }
}

module.exports = (schema) => {

    return (valueToValidate) => {

        let {error} = Joi.assert(valueToValidate, schema, {
            abortEarly: true,
        });

        if (error) {
            return returnMappedErrorMsg(error);
        }

        return true;
    }

}