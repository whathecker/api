let CATEGORIES = require('../../../db/memory/category');
const createCategoryObj = require('../../../../domain/category');

const listCategories = () => {
    return Promise.resolve(CATEGORIES);
};

const findCategoryByName = (categoryName) => {
    const category = CATEGORIES.find(category => {
        return category.categoryName === categoryName;
    });

    if (!categoryName) {
        return Promise.reject({
            status: "fail",
            reason: "category not found"
        });
    }

    return Promise.resolve(category);
};

const addCategory = (payload) => {

    const category = createCategoryObj(payload);

    if (category instanceof Error) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: category
        });
    }

    try {
        _isCategoryNameUnique(category.categoryName);
        _isCategoryCodeUnique(category.categoryCode);
    }
    catch (err) {
        return Promise.reject({
            status: "fail",
            reason: "error",
            error: err
        });
    }

    const new_id = CATEGORIES.length + 1;

    const newCategory = {
        _id: new_id.toString(),
        categoryName: category.categoryName,
        categoryCode: category.categoryCode
    };
    CATEGORIES.push(newCategory);

    return Promise.resolve(CATEGORIES[CATEGORIES.length - 1]);
};

async function _isCategoryNameUnique (categoryName) {
    const category = await findCategoryByName(categoryName);

    const { status } = category;

    if (status === "fail") return;

    throw new Error("db access for category object failed: categoryName must be unique");
}

function _isCategoryCodeUnique (categoryCode) {
    const category = CATEGORIES.find(category => {
        return category.categoryCode === categoryCode;
    });

    if (!category) return;

    throw new Error("db access for category object failed: categoryCode must be unique");
}

const deleteCategoryByName = async (categoryName) => {

    const category = await findCategoryByName(categoryName);

    const { status } = category;

    if (status === "fail") {
        return Promise.reject({
            status: "fail",
            reason: "category not found"
        });
    }

    let deletedCategory;
    CATEGORIES = CATEGORIES.filter(category => {
        
        if (category.categoryName !== categoryName) {
            return true;
        }

        if (category.categoryName === categoryName) {
            deletedCategory = category;
            return false;
        }
    });

    return Promise.resolve({
        _id: deletedCategory._id,
        status: "success"
    });
};

const dropAll = () => {
    CATEGORIES = [];
    return Promise.resolve(CATEGORIES);
};

module.exports = {
    listCategories,
    findCategoryByName,
    addCategory,
    deleteCategoryByName,
    dropAll
};