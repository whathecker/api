const removeNullsFromObject = (input) => {
    let output = input;
    for (let prop of Object.keys(output)) {
        if (output[prop] === null) {
            delete output[prop];
        }
    }
    return output;
};

module.exports = {
    removeNullsFromObject
};