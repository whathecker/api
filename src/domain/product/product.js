const ProductFactory = require('./factory');

let buildCreateProductObj = function (productValidator) {
    return ({
        channel,
        productId,
        name,
        description,
        category,
        categoryCode,
        brand,
        brandCode,
        volume,
        skinType,
        creationDate,
        lastModified,
        eanCode,
        prices,
        inventory,
        inventoryHistory
    } ={}) => {

        const payload = {
            channel,
            productId,
            name,
            description,
            category,
            categoryCode,
            brand,
            brandCode,
            volume,
            skinType,
            creationDate,
            lastModified,
            eanCode,
            prices,
            inventory,
            inventoryHistory
        };

        const result = productValidator(payload);

        if (result instanceof Error) {
            return result;
        }
        return new ProductFactory(payload);
    }
}


module.exports = buildCreateProductObj;