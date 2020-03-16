let buildCreateCategoryObj = function (categoryValidator) {
    return ({
        categoryName,
        categoryCode
    } = {}) => {

        const result = categoryValidator({categoryName, categoryCode});

        if (result instanceof Error) {
            return result;
        }

        return new Category(categoryName, categoryCode);
    }

}

class Category {
    constructor(categoryName, categoryCode) {
        this.categoryName = categoryName;
        this.categoryCode = categoryCode
    }
}

module.exports = buildCreateCategoryObj;