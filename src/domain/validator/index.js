

module.exports = (schema) => {

    return (payload) => {
        
        let {error} = schema.validate(payload, {
            abortEarly: true
        });

        if (error) {
            return error;
        }

        return true;
    }

}